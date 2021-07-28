const state={
    name:window.localStorage.getItem('nowname') || '北京',
    cityId:window.localStorage.getItem('nowcityId') || 110100
};

const actions={

};

const mutations={
    CITY_INFO(state,payload){
        state.name=payload.name;
        state.cityId=payload.cityId
    }
};

export default{
    namespaced:true,
    state,
    actions,
    mutations
}