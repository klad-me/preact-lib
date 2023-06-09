
const deniedVars = [ 'window', 'document' ];


/** Переменные для evalExpr() */
export type EvalExprArgs = {
	[key: string]: any;
};


/**
 * Выполнить JS-выражение в песочнице и вернуть результат
 * @param expr выражение
 * @param vars переменные для окружения
 * @returns результат выполнения
 */
export function evalExpr(expr: string, vars?: EvalExprArgs)
{
	// Создаем аргументы и значения для функции
	let args=[ ...deniedVars ], values=Array(deniedVars.length).fill(undefined);
	if (vars !== undefined)
	{
		for (const [ k, v ] of Object.entries(vars))
		{
			if (deniedVars.includes(k)) continue;
			args.push(k);
			values.push(v);
		}	
	}
	
	// Добавляем код функции
	args.push('return (' + expr + ')');
	
	// Запускаем
	try
	{
		let fn=Function(...args);
		return fn.call(null, ...values);
	} catch (e)
	{
		console.log('EvalExpr error:', e);
		throw e;
	}
}
