const connection = require('../configs/database');

module.exports = {

    saveNew(val){
        return new Promise((resolve, reject) => {
            const data = [val.send_id, val.send_name, val.rec_id, val.rec_name, 1, JSON.stringify({ send: val.message, time: new Date().toLocaleTimeString() }) ]
            connection.query(`INSERT INTO tb_message (send_id, send_name, rec_id, rec_name, rec_cout, message ) VALUES (?,?,?,?,?,JSON_ARRAY(?))`, data, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    edit(val){
        return new Promise((resolve, reject) => {
            if(val.type == 'send') {
                const data = JSON.stringify({ send: val.message, time: new Date().toLocaleTimeString() });

                connection.query(`UPDATE tb_message SET message = JSON_ARRAY_APPEND(message, '$', ?), rec_cout = rec_cout + 1, updated = NOW() WHERE id = ${val.id}`, data, (error, result) => {
                    if(error) return reject(error);
                    resolve(result)
                })
            } 
            else {
                const data = JSON.stringify({ receive: val.message, time: new Date().toLocaleTimeString() });
                
                connection.query(`UPDATE tb_message SET message = JSON_ARRAY_APPEND(message, '$', ?), send_cout = send_cout + 1, updated = NOW() WHERE id = ${val.id}`, data, (error, result) => {
                    if(error) return reject(error);
                    resolve(result)
                })
            } 

            
        })
    },

    admin(){
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO tb_message SET ? `, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    admin(id){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_message WHERE rec_id = ${id} OR send_id = ${id} ORDER BY updated DESC`, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    user(id, youId){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_message WHERE send_id = ${id} AND rec_id = ${youId}`, (error, result) => {
                if (error) return reject(error);
        
                if (result.length === 0) {  // ตรวจสอบว่าผลลัพธ์ว่างเปล่าหรือไม่
                    connection.query(`SELECT * FROM tb_message WHERE send_id = ${youId} AND rec_id = ${id}`, (errorTurn, resultTurn) => {
                        if (errorTurn) return reject(errorTurn);
                        
                        if (resultTurn.length > 0) {
                            resolve(resultTurn[0]);
                        }
                    });
                } else {
                    resolve(result[0]);
                }
            });
        });
    },

    deleteItem(id, value){
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE tb_message SET message = JSON_ARRAY(?) WHERE id = ${id} `, [value], (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },


    cout(id, type){
        return new Promise((resolve, reject) => {
            if(type == 'send') {
                connection.query(`UPDATE tb_message SET send_cout = 0 WHERE id = ${id}`, (error, result) => {
                    if(error) return reject(error);
                    resolve(result)
                })
            } else {
                connection.query(`UPDATE tb_message SET rec_cout = 0 WHERE id = ${id}`, (error, result) => {
                    if(error) return reject(error);
                    resolve(result)
                })
            }
            
        })
    },

    Delete(id){
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM tb_message WHERE id = ${id}`, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    

}