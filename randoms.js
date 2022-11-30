
process.on('message', message => {
    let result = {};
    for (let i=0; i<message.cantidad; i++) {
        let num = Math.floor(Math.random()*1000);
    if (!result[num]) result[num]=1;
    else result[num]+=1;
    }
    process.send({result})
    process.exit()
})

process.send('listo')