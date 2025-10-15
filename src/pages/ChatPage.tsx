import { Header } from "@/components/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ragService } from "@/services/ragService";
import { useTranslationSetup } from "@/utils/translationUtils";
import { AlertCircle, Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatPage = () => {
  const t = useTranslationSetup();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: t("chat.welcome_message"),
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize RAG service
  useEffect(() => {
    const initializeRAG = async () => {
      try {
        console.log("ChatPage: Starting RAG initialization...");
        setApiError("Initializing AI assistant...");
        await ragService.initializeCollection();
        setIsInitialized(true);
        setApiError("");
        console.log("ChatPage: RAG initialization completed successfully");
      } catch (error) {
        console.error("ChatPage: Error initializing RAG service:", error);
        setApiError(
          "Failed to initialize AI assistant. Please refresh the page."
        );
      }
    };

    initializeRAG();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isInitialized) return;

    // Basic input sanitization
    const sanitizedInput = inputValue.trim().slice(0, 500);
    if (!sanitizedInput) {
      setApiError("Please enter a valid message");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: sanitizedInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setApiError("");

    try {
      const response = await ragService.generateRAGResponse(sanitizedInput);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setApiError(errorMessage);

      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {t("chat.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            {apiError && (
              <Alert variant="destructive" className="flex-shrink-0">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {message.sender === "user" ? (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Input
                placeholder={
                  isInitialized
                    ? t("chat.input_placeholder")
                    : "Initializing..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || !isInitialized}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !isInitialized}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
