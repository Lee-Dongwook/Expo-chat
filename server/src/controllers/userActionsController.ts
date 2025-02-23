export const blockedUsers: { [userId: string]: string[] } = {};

interface Report {
  messageId: string;
  reportedBy: string;
  reason: string;
  timestamp: Date;
}
export const reportedMessages: Report[] = [];

export const blockUser = (req: any, res: any) => {
  const { userId, blockUserId } = req.body;
  if (!userId || !blockUserId) {
    return res
      .status(400)
      .json({ error: "userId와 blockUserId가 필요합니다." });
  }
  if (!blockedUsers[userId]) {
    blockedUsers[userId] = [];
  }
  blockedUsers[userId].push(blockUserId);
  res.json({ message: "사용자 차단 완료" });
};

export const reportMessage = (req: any, res: any) => {
  const { messageId, reportedBy, reason } = req.body;
  if (!messageId || !reportedBy || !reason) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }
  reportedMessages.push({
    messageId,
    reportedBy,
    reason,
    timestamp: new Date(),
  });
  res.json({ message: "메시지 신고 완료" });
};
