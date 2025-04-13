import React, { useRef } from "react";
import "./MarkdownCommentEditor.css";

interface Props {
    text: string;
    setText: (value: string) => void;
    preview: boolean;
    setPreview: (value: boolean) => void;
}

const MarkdownCommentEditor: React.FC<Props> = ({ text, setText, preview, setPreview }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormatting = (before: string, after: string = before) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = text.substring(start, end);

        const newText = text.slice(0, start) + before + selected + after + text.slice(end);
        setText(newText);

        const cursor = start + before.length + selected.length + after.length;
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursor, cursor);
        }, 0);
    };

    return (
        <div className="comment-editor">
            <div className="editor-toolbar">
                <button type="button" onClick={() => insertFormatting("**")}>B</button>
                <button type="button" onClick={() => insertFormatting("*")}>I</button>
                <button type="button" onClick={() => insertFormatting("~~")}>S</button>
                <button type="button" onClick={() => insertFormatting("`")}>Code</button>
                <button type="button" onClick={() => setPreview(!preview)}>
                    {preview ? "Редактировать" : "Предпросмотр"}
                </button>
            </div>

            {preview ? (
                <div className="preview-area">{text}</div>
            ) : (
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите текст"
                />
            )}
        </div>
    );
};

export default MarkdownCommentEditor;
