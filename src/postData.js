import Pool from 'pg-pool';
async function postData(table,data){
    const pool=new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false,
            },
        })
        const client = await pool.connect();
        try{
            switch (table) {
                case 'signup':
                    try {
                        const query=`insert into auth values(nextval('userIdSeq'),$1,$2,'2002-02-27','sp359422@gmail.com')`;
                        const {rows}= await client.query(query,[`${data.userName}`,`${data.passkey}`]);
                        if (rows.length > 0) {
                            return true; 
                        } else {
                            return null; 
                        }
                    } catch (error) {
                    console.log(error);
                    }
                    break;
                case 'newsletter':
                    try {
                        const query=`insert into newsletter values(nextval('id'),$1,current_timestamp)`;
                        const {rowCount}= await client.query(query,[`${data.Email}`]);
                        if (rowCount > 0) {
                            return true; 
                        } else {
                            return false; 
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                default:
                    break;
            }
        }
        catch(error){
            console.log(error);
        }
}

export default postData;