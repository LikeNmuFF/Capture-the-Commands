// Redirect handling is integrated into CommandParser.ts
// This file exists for future expansion of redirect logic

export interface RedirectInfo {
  operator: '>' | '>>'
  target: string
}
