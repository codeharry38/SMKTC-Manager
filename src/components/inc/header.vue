<template>
    <v-navigation-drawer v-if="(currentRouter != 'signin' && currentRouter != 'forgotpassword' && currentRouter != 'updatepassword')" v-model="drawer" :mini-variant.sync="mini" app mini-variant-width="80px" max-height="90%" dark  class="ma-3 pa-3 customNav">
        <v-list-item class="px-2">
            <span v-if="mini == false">Stock Trading</span>
            <v-spacer  v-if="mini == false"></v-spacer>
            <v-btn v-if="mini == true" icon @click.stop="mini = !mini"><v-icon >mdi-menu</v-icon></v-btn>
            <v-btn v-else icon @click.stop="mini = !mini"><v-icon >mdi-chevron-left</v-icon></v-btn>
        </v-list-item>
        <v-divider class="py-3"></v-divider>
        <v-list dense >
            <template v-for="(item, j ) in items">
                <v-list-group v-if="item.children" :key="item.title" no-action:prepend-icon="item.Ficon" :append-icon="item.icon">
                    <template v-slot:activator>
                        <v-list-item-action>
                            <v-icon>{{ item.Ficon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <router-link v-for="(child, i) in item.children" :key="i" link :to="{name:child.link}" :class="currentRouter == child.link ? `SidebarLink activelink` : `SidebarLink`">
                        <v-list-item>
                            <v-list-item-action v-if="child.icon">
                                <v-icon>{{ child.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ child.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>
                </v-list-group>
                <router-link v-else :key="j" link :to="{name:item.link}" :class="currentRouter == item.link ? `SidebarLink activelink` : `SidebarLink`">
                    <v-list-item >
                        <v-list-item-action>
                            <v-icon>{{ item.Ficon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.title }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>
            </template>
            <v-list-item @click="logout" >
                <v-list-item-action>
                    <v-icon>mdi-power</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Logout
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: 'HomeHeader',
      data () {
        return {
            currentRouter: this.$route.name,
          drawer: true,
          items: [
            { title: 'Dashboard', Ficon: 'mdi-view-dashboard', link:'dashboard' },
            { title: 'Organizations', Ficon: 'mdi-city', link:'organization' },
            { title: 'Offers', Ficon: 'mdi-octagram', link:'offer' },
            { title: 'Prize', Ficon: 'mdi-account-multiple', link:'prize' },
            { title: 'Games', Ficon: 'mdi-gamepad-variant', link:'game' },
            { title: 'Tickets', Ficon: 'mdi-ticket', link:'ticket' },
            { title: 'Quick Book', Ficon: 'mdi-book-open-page-variant', link:'billing' },
            { title: 'Players', Ficon: 'mdi-account-multiple', link:'player' },
            { title: 'Banners', Ficon: 'mdi-account-multiple', link:'banner' },
            { title: 'Stocks',
                Ficon:'mdi-account-group-outline',
                icon: 'mdi-chevron-down', 'icon-alt': 'mdi-chevron-up',
                children: [
                    {title: 'Listed Stocks', link:'stocklist'},
                    {title: 'Lookup Stocks', link:'dashboard'},
                ],
             },
            { title: 'Users', Ficon: 'mdi-account',link:'user' },
          ],
          mini: false,
        }
      },
      methods: {
            async logout() {
                await this.$store.dispatch('destroyToken');
                location.reload();
            },

        }
    }
</script>
<style scoped>
.customNav{
    border-top-left-radius:20px;
    border-bottom-left-radius:20px;
    height:97% !important;
}
.SidebarLink{
    text-decoration:none;
}
.router-link-exact-active .v-list-item__action .v-icon{
    color:#4caf50 !important
}
.router-link-exact-active .v-list-item__content .v-list-item__title{
    color:#4caf50 !important
}
</style>