//Pags
import Dashboard from '../views/dashboard.vue'
import Signin from '../views/auth/signin.vue'

//Masters
import User from '../views/user.vue'
import Organization from '../views/organization.vue'
import Game from '../views/game.vue'
import Ticket from '../views/ticket.vue'
import Offer from '../views/offer.vue'
import Prize from '../views/prize/prize.vue'
import PrizeEdit from '../views/prize/edit.vue'
import Player from '../views/player.vue'
import PlayerScreen from '../views/playerscreen.vue'
import FullGame from '../views/fullgame.vue'
import StockList from '../views/stocklist.vue'
// Success
import Success from '../views/success.vue'
import Payment from '../views/payment.vue'

import forgotPassword from '../views/auth/forgot.vue'
import updatePassword from '../views/auth/reset.vue'

import Billing from '../views/invoice/billings.vue'
import Invoice from '../views/invoice/invoice.vue'
import Banner from '../views/banner.vue'

export default [
    //Pages
    {path:'/', component:Dashboard, name:'dashboard', meta: { requiresAuth: true}},

    //Master
    {path:'/users', component:User, name:'user', meta: { requiresAuth: true}},
    {path:'/organizations', component:Organization, name:'organization', meta: { requiresAuth: true}},
    {path:'/games', component:Game, name:'game', meta: { requiresAuth: true}},
    {path:'/player', component:Player, name:'player', meta: { requiresAuth: true}},
    {path:'/tickets', component:Ticket, name:'ticket', meta: { requiresAuth: true}},
    {path:'/offers', component:Offer, name:'offer', meta: { requiresAuth: true}},
    {path:'/prize', component:Prize, name:'prize', meta: { requiresAuth: true}},
    {path:'/prize/edit/:id', component:PrizeEdit, name:'prizeEdit', meta: { requiresAuth: true}},
    {path:'/playerscreen/:game', component:PlayerScreen, name:'playerscreen', meta: { requiresAuth: true}},
    {path:'/fullgame/:id', component:FullGame, name:'fullgame', meta: { requiresAuth: true}},
    {path:'/stocklist', component:StockList, name:'stocklist', meta: { requiresAuth: true}},
    {path:'/billing', component:Billing, name:'billing', meta: { requiresAuth: true}},
    {path:'/invoice/:game', component:Invoice, name:'invoice', meta: { requiresAuth: true}},
    // Others
    {path:'/banner', component:Banner, name:'banner', meta: { requiresAuth: true}},
    {path:'/success', component:Success, name:'success'},
    {path:'/payment', component:Payment, name:'payment'},

    // Auth
    {path:'/signin', component:Signin, name:'signin', meta: { requiresVisitor: true }},
    {path:'/forgot/password', component:forgotPassword, name:'forgotpassword',  meta: { requiresVisitor: true }},
    {path:'/update/password', component:updatePassword, name:'updatepassword',  meta: { requiresVisitor: true }},

]