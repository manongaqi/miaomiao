<template>
    <div class="movie_body">
		<ul v-infinite-scroll="loadMore" infinite-scroll-distance="10" infinite-scroll-disabled="loading"
        infinite-scroll-immediate-check="false">
			<li v-for="item in datalist" :key="item.filmId">
				<div class="pic_show" @click="handleToDetail(item.filmId)"><img :src="item.poster"></div>
				<div class="info_list">
					<h2 @click="handleToDetail(item.filmId)">{{item.name}}</h2>
					<p><span class="person">17746</span> 人想看</p>
					<p>主演: {{item.actors | actorsName}}</p>
					<p>2018-11-30上映</p>
				</div>
				<div class="btn_pre">
					预售
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'

Vue.filter('actorsName',function(item){
	var newActors = item.map(item=>item.name)
	return newActors.join('  ')
})
export default {
	name:'ComingSoon',
	data(){
		return{
			datalist:[],
			current:1,
			prevCityId:-1
		}
	},
	activated(){

		var cityId = this.$store.state.city.cityId;
		if(this.prevCityId === cityId){return;}
		console.log(123)

		axios({
			url:`https://m.maizuo.com/gateway?cityId=${cityId}&pageNum=1&pageSize=10&type=2&k=7803030`,
			headers:{
				'X-Client-Info': `{"a":"3000","ch":"1002","v":"5.0.4","e":"16263341444941200960258049","bc":"${cityId}"}`,
				'X-Host': 'mall.film-ticket.film.list'
			}
		}).then((res)=>{
			this.datalist = res.data.data.films
			this.prevCityId = cityId;
		})
	},
	methods:{
		loadMore(){
			this.current++;

			axios({
				url:`https://m.maizuo.com/gateway?cityId=${cityId}&pageNum=${this.current}&pageSize=10&type=2&k=7803030`,
				headers:{
					'X-Client-Info': `{"a":"3000","ch":"1002","v":"5.0.4","e":"16263341444941200960258049","bc":"${cityId}"}`,
					'X-Host': 'mall.film-ticket.film.list'
				}
			}).then((res)=>{
				this.datalist = [...this.datalist,...res.data.data.films]
			})
		},
		handleToDetail(movieId){
			this.$router.push('/movie/detail/2/'+movieId)
		}
	},

}
</script>

<style scoped>
    #content .movie_body{ flex:1; overflow:auto;}
    .movie_body ul{ margin:0 12px; overflow: hidden;}
    .movie_body ul li{ margin-top:12px; display: flex; align-items:center; border-bottom: 1px #e6e6e6 solid; padding-bottom: 10px;}
    .movie_body .pic_show{ width:64px; height: 90px;}
    .movie_body .pic_show img{ width:100%;}
    .movie_body .info_list { margin-left: 10px; flex:1; position: relative;}
    .movie_body .info_list h2{ font-size: 17px; line-height: 24px; width:150px; overflow: hidden; white-space: nowrap; text-overflow:ellipsis;}
    .movie_body .info_list p{ font-size: 13px; color:#666; line-height: 22px; width:200px; overflow: hidden; white-space: nowrap; text-overflow:ellipsis;}
    .movie_body .info_list .grade{ font-weight: 700; color: #faaf00; font-size: 15px;}
    .movie_body .info_list img{ width:50px; position: absolute; right:10px; top: 5px;}
    .movie_body .btn_mall , .movie_body .btn_pre{ width:47px; height:27px; line-height: 28px; text-align: center; background-color: #f03d37; color: #fff; border-radius: 4px; font-size: 12px; cursor: pointer;}
    .movie_body .btn_pre{ background-color: #3c9fe6;}
</style>
