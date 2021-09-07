import router from './router'
import store from './store'


router.beforeEach(async(to, from, next) => {
    
        var token = window.sessionStorage.getItem('Authorization');
        if( token ) {
            if ( !(store.state.permission.addRoutes && store.state.permission.addRoutes.length>0) ) {
                try{
                    const roles = ["admin"]
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                }catch (error) {
                    console.log(error)
                }
            }else{
                next()
            }
        }else{
          if (to.path === '/login') {
                next()
            } else {
                next('/login')
            }
        }
  
})