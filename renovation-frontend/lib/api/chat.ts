import { getStoredToken } from "@/lib/api/auth";

export type ChatConversation = {
  id: number;
  user_one_id?: number;
  user_two_id?: number;
  buyer_request_offer_id?: number | null;
};

export async function initiateChat(input: {
  user_id: number;
  buyer_request_offer_id?: number | null;
  product_id?: number | null;
}): Promise<ChatConversation> {
  const token = getStoredToken();
  const res = await fetch("/api/chat/initiate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });

  const json = (await res.json().catch(() => ({}))) as ChatConversation & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(json.message || "Unable to start chat");
  }

  return json;
}
