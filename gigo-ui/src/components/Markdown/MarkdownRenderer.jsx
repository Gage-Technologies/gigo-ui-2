import React, {Suspense, useCallback, useEffect, useState, lazy} from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {defaultSchema} from 'rehype-sanitize';
import remarkCodeBlock from 'remark-code-blocks';
const ReactMarkdown = lazy(() => import('react-markdown'));
// import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import ReactSyntaxHighlighter from '../SyntaxHighlighter/ReactSyntaxHighlighter';
import {darkSyntaxTheme, lightSyntaxTheme} from './SyntaxHighlights';
import {alpha, Box, IconButton, Tooltip, Typography} from '@mui/material';
import {theme} from '@/theme';
import merge from 'deepmerge';
import {Check, ContentCopy, Launch} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {visit} from 'unist-util-visit';
import config from "../../config";
import "./css/MarkdownRenderer.css";
import ErrorBoundary from "../ErrorBoundary";
import SheenPlaceholder from '../Loading/SheenPlaceholder';

const syntaxHighlightingSchema = merge(defaultSchema, {
  attributes: {
    code: [...(defaultSchema.attributes.code || []), 'class'],
  },
});

const MarkdownRenderer = ({
                            markdown,
                            style,
                            onAllMediaLoaded,
                            imgProxy,
                            remarkPlugins,
                            rehypePlugins,
                            goToCallback
                          }) => {
  const CopyCode = styled('code')(() => ({
    cursor: 'pointer',

    // hightlight on hover
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },

    // hightlight on click
    '&:active': {
      backgroundColor: alpha(theme.palette.primary.main, 0.5),
    }
  }));

  const [copied, setCopied] = useState(null);
  const [mediaCount, setMediaCount] = useState(0);
  const [loadedMediaCount, setLoadedMediaCount] = useState(0);

  const [portals, setPortals] = useState([])

  useEffect(() => {
    if (theme.palette.mode === 'light') {
      require('./css/github-markdown-light.css');
    } else {
      require('./css/github-markdown-dark.css');
    }
  }, [theme.palette.mode]);

  useEffect(() => {
    if (mediaCount === loadedMediaCount && mediaCount > 0) {
      onAllMediaLoaded(); // This function can be used to measure height
    }
  }, [mediaCount, loadedMediaCount, onAllMediaLoaded]);

  useEffect(() => {
    // Reset counters when new markdown is received
    setLoadedMediaCount(0);
    // Use regex to count number of images in markdown and HTML
    const markdownImageRegex = /!\[[^\]]*\]\([^)]+\)/g;
    const htmlImageRegex = /<img [^>]*src="[^"]*"[^>]*>/g;
    // User regex to count number of videos in markdown and HTML
    const htmlVideoRegex = /<video [^>]*src="[^"]*"[^>]*>/g;

    const markdownMatches = markdown.match(markdownImageRegex) || [];
    const htmlMatches = markdown.match(htmlImageRegex) || [];
    const htmlVideoMatches = markdown.match(htmlVideoRegex) || [];

    setMediaCount(markdownMatches.length + htmlMatches.length + htmlVideoMatches.length);
  }, [markdown]);

  const handleMediaLoad = useCallback((x) => {
    setLoadedMediaCount(prevCount => prevCount + 1);
  }, []);

  useEffect(() => {
    let p = [];
    for (let i = 0; i < remarkPlugins.length; i++) {
      let rp = remarkPlugins[i][1]();
      p = p.concat(rp)
    }
    for (let i = 0; i < rehypePlugins.length; i++) {
      let rp = rehypePlugins[i][1]();
      p = p.concat(rp)
    }
    setPortals(p);
  }, [markdown, remarkPlugins, rehypePlugins]);

  function rehypeOnLoadPlugin() {
    return (tree) => {
      visit(tree, 'element', (node) => {
        if (node.tagName === 'img') {
          node.properties.id = "img:" + node.properties.src;
          node.properties.onLoad = () => {
            handleMediaLoad({target: node})
          };
          node.properties.loading = "lazy";
          if (config.imgCdnProxy && imgProxy) {
            node.properties.src = config.imgCdnProxy + imgProxy + node.properties.src;
          }
        }

        if (node.tagName === 'video') {
          // retrieve the first source in the children if it exists
          let src;
          if (node.children.length > 0) {
            src = node.children[0].properties.src;
          } else {
            src = node.properties.src;
          }
          node.properties.id = "video:" + src;

          node.properties.onLoadedData = () => {
            handleMediaLoad({target: node})
          };
          node.properties.loading = "lazy";
          node.properties.controls = false;
          node.properties.muted = true;
          node.properties.playsInline = true;
          node.properties.autoPlay = true;
          node.properties.loop = true;
        }
      });
    };
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
  };

  return (
    <>
      <div className="markdown-body" style={style}>
        <ErrorBoundary>
          <Suspense fallback={(
            <Box sx={{
              width: "100%",
              height: "100%",
            }}>
              <SheenPlaceholder width={"100%"} height={"100%"} />
            </Box>
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkCodeBlock, ...remarkPlugins.map(x => x[0])]}
              rehypePlugins={[rehypeRaw, rehypeOnLoadPlugin, {settings: syntaxHighlightingSchema}, ...rehypePlugins.map(x => x[0])]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  let t = String(children).trim();

                  // return styled code
                  if (!inline && match) {
                    const goToLinkMatch = t.trim().match(/^\[[^\]]+\]\(editor:\/\/(.+?)#(\d+)(?:-(\d+))?\)/);
                    let goToLink = null;
                    if (goToLinkMatch) {
                      // regardless of whether the user has a goToCallback, we still want to remove the link from the text
                      t = t.replace(goToLinkMatch[0], "").trim();

                      if (goToCallback) {
                        const filePath = goToLinkMatch[1];
                        let startLine = parseInt(goToLinkMatch[2], 10);
                        if (startLine > 0) {
                          startLine -= 1;
                        }
                        // Use a ternary operator to handle the optional end line
                        const endLine = goToLinkMatch[3] ? parseInt(goToLinkMatch[3], 10) : startLine + 1; // Use startLine if endLine is not specified

                        goToLink = (
                          <Tooltip title={"Go To Code"} placement="top">
                            <IconButton
                              onClick={() => goToCallback(filePath, parseInt(startLine, 10), parseInt(endLine, 10))}
                              size="small"
                              color={"secondary"}
                            >
                              <Launch style={{fontSize: "12px", marginLeft: "3px"}}/>
                            </IconButton>
                          </Tooltip>
                        );
                      }
                    }

                    return (
                      <div style={{position: 'relative', marginRight: "18px", paddingTop: "4px"}}>
                        <Typography
                          variant={"body2"}
                          className="notranslate"
                          sx={{
                            fontSize: "11px",
                            textTransform: "none",
                            fontWeight: "normal",
                            fontFamily: "monospace",
                            position: 'absolute',
                            color: theme.palette.text.primary,
                            top: 3,
                            left: 8,
                            zIndex: 1,
                          }}
                        >
                          {match[1] !== "" && match[1] !== "_" ? match[1] : "plaintext"}
                        </Typography>
                        <Box
                          display={"inline-flex"}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: -14,
                            zIndex: 1,
                            paddingTop: "2px",
                          }}
                        >
                          <Tooltip title={copied === t ? "Copied" : "Copy"} placement="top">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(t)}
                              color={copied === t ? 'success' : 'primary'}
                            >
                              {copied === t ? (
                                <Check sx={{height: 14, width: 14}}/>
                              ) : (
                                <ContentCopy sx={{height: 14, width: 14}}/>
                              )}
                            </IconButton>
                          </Tooltip>
                          {goToLink}
                        </Box>
                        <ErrorBoundary>
                          <Suspense 
                            fallback={
                              <div style={{
                                padding: "8px",
                                paddingTop: "18px",
                              }}>
                                {t}
                              </div>
                            }
                          >
                            <ReactSyntaxHighlighter
                              style={theme.palette.mode === 'light' ? lightSyntaxTheme : darkSyntaxTheme}
                              language={match[1]}
                              PreTag="div"
                              className="notranslate"
                              {...props}
                            >
                              {t}
                            </ReactSyntaxHighlighter>
                          </Suspense>
                        </ErrorBoundary>
                      </div>
                    );
                  }

                  // return inline code
                  return (
                    <Tooltip title={copied === t ? "Copied" : "Click to copy"} placement="top">
                      <span
                        onClick={() => copyToClipboard(t)}
                      >
                        <CopyCode
                          onClick={() => copyToClipboard(t)}
                          className={className}
                          {...props}
                        >
                          {children}
                        </CopyCode>
                      </span>
                    </Tooltip>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </Suspense>
        </ErrorBoundary>
      </div>
      {portals}
    </>
  );
};

MarkdownRenderer.defaultProps = {
  style: {
    overflowWrap: 'break-word',
    borderRadius: '10px',
    padding: '2em 3em',
    width: '85%',
  },
  onAllMediaLoaded: () => {
  },
  imgProxy: null,
  remarkPlugins: [],
  rehypePlugins: [],
  goToCallback: null,
};

export default MarkdownRenderer;
