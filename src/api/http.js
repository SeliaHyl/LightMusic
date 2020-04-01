import axios from 'axios'
import service from './contactApi.js'

let instance = axios.create({
	baseURL:'http://server.attribute.top/music/api',//主接口
    timeout:20000,
    withCredentials: true
})

const Http = {} //包裹请求方法的容器

for(let key in service) {
	let api = service[key]; //method,url
	Http[key] = async function(
		params,  //请求参数
		config = {} //配置参数
	) {
		let response = {}; //请求返回值
		if(api.method === 'get') {
			config.params = params
			try {
				response = await instance[api.method](api.url, config)
			} catch(err) {
				response = err
			}
		}
		return response; //返回响应值
	}
}

//1.请求拦截器
instance.interceptors.request.use(config=>{
	//发起请求前做什么
	return config
},err=>{
	//请求错误做什么
	console.log(err)
})

//2.响应拦截器
instance.interceptors.response.use(res=>{
	//请求成功
	return res.data
},err=>{
	//请求错误
	console.log(err)
})

export default Http