import DocumentationUI from '@/components/Documentation/Documentation';
import {Suspense} from "react";
import SuspenseFallback from "@/components/SuspenseFallback";
import Layout from "@/app/layout";

export default async function Documentation({params}: { params: { level: string[] } }) {
    const relativePath = params.level.join("/")

    const pathsToNodes = {
        "introduction/intro.md": "1",
        "workspace/workspace_overview_1.md": "2",
        "workspace/base_docker_image/base_docker_image_2.md": "3",
        "workspace/resources_specified/resources_specified_3.md": "4",
        "workspace/vscode_extensions/vscode_extensions_4.md": "5",
        "workspace/docker_service/additional_docker_service_5.md": "6",
        "workspace/command_line_arguments/command_line_arguments_6.md": "7",
        "workspace/default_workspace_config/default_workspace_config_7.md": "8",
        "extension/extension_overview_1.md": "9",
        "extension/code_teacher/extension_code_teacher_2.md": "10",
        "extension/automatic_git/extension_automatic_git_3.md": "11",
        "extension/tutorial_viewer/extension_tutorial_viewer_4.md": "12",
        "extension/tutorial_creator/extension_tutorial_creator_5.md": "13",
        "extension/afk_setting/extension_afk_setting_6.md": "14",
        "pro/pro_overview_1.md": "15",
        "pro/pro_purchase_2.md": "16"
    }

    let selectedNode = ""

    let content = await fetch('https://raw.githubusercontent.com/Gage-Technologies/gigo-documentation/master/' + relativePath).then(async (response) => {
        if (!response.ok) {
            window.location.href = "/documentation/introduction/intro.md";
            // setMarkdownContent("### Failed to download file: " + url + "\nStatus Code: " + response.status + "\nResponse: " + await response.text());
            return;
        }

        return await response.text();
    });

    return (
        <Layout>
            <Suspense fallback={<SuspenseFallback/>}>
                <DocumentationUI
                    markdownContent={content}
                    selectedNode={[selectedNode]}
                />
            </Suspense>
        </Layout>
    );
}
