// import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
// import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
// import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
// import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
// import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
// import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
// import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
// import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
// import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
// import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
// import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
// import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
// import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
// import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
// import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
// import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
// import scala from 'react-syntax-highlighter/dist/esm/languages/prism/scala';
// import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
// import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
// import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
// import r from 'react-syntax-highlighter/dist/esm/languages/prism/r';
// import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
// import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
// import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
// import less from 'react-syntax-highlighter/dist/esm/languages/prism/less';
// import sass from 'react-syntax-highlighter/dist/esm/languages/prism/sass';
// import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
// import {lazy} from "react";
//
// SyntaxHighlighter.registerLanguage('javascript', javascript);
// SyntaxHighlighter.registerLanguage('jsx', jsx);
// SyntaxHighlighter.registerLanguage('python', python);
// SyntaxHighlighter.registerLanguage('bash', bash);
// SyntaxHighlighter.registerLanguage('json', json);
// SyntaxHighlighter.registerLanguage('markdown', markdown);
// SyntaxHighlighter.registerLanguage('diff', diff);
// SyntaxHighlighter.registerLanguage('yaml', yaml);
// SyntaxHighlighter.registerLanguage('typescript', typescript);
// SyntaxHighlighter.registerLanguage('rust', rust);
// SyntaxHighlighter.registerLanguage('c', c);
// SyntaxHighlighter.registerLanguage('cpp', cpp);
// SyntaxHighlighter.registerLanguage('csharp', csharp);
// SyntaxHighlighter.registerLanguage('java', java);
// SyntaxHighlighter.registerLanguage('swift', swift);
// SyntaxHighlighter.registerLanguage('kotlin', kotlin);
// SyntaxHighlighter.registerLanguage('scala', scala);
// SyntaxHighlighter.registerLanguage('go', go);
// SyntaxHighlighter.registerLanguage('php', php);
// SyntaxHighlighter.registerLanguage('ruby', ruby);
// SyntaxHighlighter.registerLanguage('r', r);
// SyntaxHighlighter.registerLanguage('sql', sql);
// SyntaxHighlighter.registerLanguage('css', css);
// SyntaxHighlighter.registerLanguage('scss', scss);
// SyntaxHighlighter.registerLanguage('less', less);
// SyntaxHighlighter.registerLanguage('sass', sass);
// SyntaxHighlighter.registerLanguage('tsx', tsx);

import {lazy} from "react";

const ReactSyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(module => {
    // Import the SyntaxHighlighter component from the module
    const { Prism: SyntaxHighlighter } = module;
    return { default: SyntaxHighlighter };
}));

export default ReactSyntaxHighlighter;
