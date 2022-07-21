module.exports = {
    HOST:"localhost",
    USER:"root",
    PASSWORD:"",
    DB:"Back-End_fewfans",
    dialect:"mysql",
    timezone:"asia/bangkok",
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}