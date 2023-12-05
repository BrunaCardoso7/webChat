// Implementação do middleware de limitação de taxa para o evento chatOn
export const rateLimitMiddleware = (socket, next) => {
    let arrayMensagem = [];
    let quantidadeMensagem = 0;

    socket.onAny((eventName, ...args) => {
        if (eventName === 'chatOn') {
            const tempoLimite = 10000;
            const limiteMensagem = 5;
           
            const now = Date.now();
            
            arrayMensagem = arrayMensagem.filter((enviados) => now - enviados < tempoLimite);

          
            arrayMensagem.push(now);
            
            
            quantidadeMensagem = arrayMensagem.length;

            console.log("quantidade de mensagens: " + quantidadeMensagem);

            if (quantidadeMensagem > limiteMensagem) {
                console.log('limite de mensagens excedido!!!');
                console.log('fim do middleware de taxa de limite');
                return next(new Error('Error: limiteMenssagemTransbordou'));
            }
        }
    });

    next();
};