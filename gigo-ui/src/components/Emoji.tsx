'use client'
import React from "react";
import {Dialog, DialogContent} from "@mui/material";
import {theme} from "@/theme";
import Picker from '@emoji-mart/react';
import {useSearchParams} from "next/navigation";

type EmojiProps = {
    open: boolean; // Prop to control dialog visibility
    closeCallback: () => void; // Callback function to close dialog
    onEmojiSelect: (emoji: any) => void; // Callback function when an emoji is selected
};

export default function EmojiPicker({open, closeCallback, onEmojiSelect}: EmojiProps) {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const addEmoji = (emoji: any) => {
        onEmojiSelect(emoji);
    };

    let dialogPosition: any = {
        bottom: 80,
        right: 300,
        width: "450px",
        height: "435px",
    }
    if (isMobile) {
        dialogPosition = {
            bottom: 120,
            // right: "5vw",
            width: "90vw",
            height: "435px",
        }
    }

    return (
        <>
            <Dialog
                open={open} // Controlled by prop
                onClose={closeCallback} // Callback function to close dialog
                BackdropProps={{style: {backgroundColor: "transparent"}}}
                PaperProps={{
                    style: {
                        position: "absolute",
                        borderRadius: "10px",
                        // @ts-ignore
                        backgroundColor: theme.palette.background.chat,
                        ...dialogPosition,
                    },
                }}
            >
                <DialogContent
                    style={{
                        padding: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowX: 'hidden',
                    }}
                >
                    <Picker
                        data={async () => {
                            const response = await fetch(
                                'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
                            )

                            return response.json()
                        }}
                        onEmojiSelect={addEmoji}
                        theme={theme.palette.mode}
                        autoFocus={true}
                        emojiSize={!isMobile ? 24 : 20}
                        emojiButtonSize={!isMobile ? 47 : 36}
                        perline={12}
                        style={{flex: 1}}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
