// Класс для обработки ошибок Prismium | Class for handling Prismium errors
export class PrismiumError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'PrismiumError';
    this.originalError = originalError;
  }
}
