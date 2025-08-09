# c2chat

minimalist chat app with persistent conversations

## what it has

- clean ui for chatting with ai
- sidebar with chat history and pagination
- markdown rendering for formatted responses
- auto-generated chat titles via ai
- responsive design with mobile support

## gemini integration

uses google gemini 2.5-flash model for ai responses. maintains conversation context by converting stored messages to gemini format (user/model roles). generates chat titles automatically using gemini 1.5-flash when first exchange happens.

## zustand state mgmt

single store manages all app state - chat list, current messages, input, loading states. handles pagination for chat history. syncs local state with server data. creates/deletes chats and persists messages.

## chat slug generation

each chat gets unique readable id like "curious-otter-42". combines random adjective + animal + 2-digit number. used as url-friendly identifier and db lookup key.

## mongodb storage

stores chat docs with slug, title, messages array, timestamps. message subdocs have role (user/assistant) and content. indexed on slug for fast lookups. uses mongoose schemas with automatic timestamps.
