export interface TerminalCommand {
  input: string;
  output: string | null;
  timestamp: number;
}

export interface MailFormData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

export interface BlackjackState {
  deck: string[];
  playerHand: string[];
  dealerHand: string[];
  bet: number;
  balance: number;
  gamePhase: 'betting' | 'playing' | 'dealerTurn' | 'result';
  result: 'win' | 'lose' | 'push' | 'blackjack' | null;
  gameOver: boolean;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

export interface TextDocument {
  id: string;
  title: string;
  content: string;
  lineCount: number;
}
