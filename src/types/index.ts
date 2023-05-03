export * from './JsonSchema';


/**
 * Тип для идентификатора таймера (то, что возвращает setTimeout)
 */
export type TimerId = ReturnType<typeof setTimeout>;

/**
 * Тип для идентификатора интервала (то, что возвращает setInterval)
 */
export type IntervalId = ReturnType<typeof setInterval>;
