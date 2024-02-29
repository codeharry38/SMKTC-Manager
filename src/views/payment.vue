<template>
    <v-container grid-list-xs>
        <stripe-checkout
        ref="checkoutRef"
        mode="payment"
        :pk="publishableKey"
        :line-items="lineItems"
        :success-url="successURL"
        :cancel-url="cancelURL"
        @loading="v => loading = v"
      />
        <v-row>
            <v-col cols="4" class="mx-auto mt-15">
                <v-card class="mx-auto" max-width="400">
                    <v-img class="white--text align-end" height="200px"
                        src="/images/loginpage.jpg">
                        <v-card-title>Trading Game Demo</v-card-title>
                    </v-img>
                    <v-card-text class="text--primary">
                        <div>Sponser: ABC</div>
                        <div>Last Entrance: 25/09/2022</div>
                        <div>Start At: 20/09/2022 End At: 30/09/2022</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="black" class="white--text" block :loading="isLoading" @click="submit">$15.00 Pay Now</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        
    </v-container>
  
  </template>
  
  <script>
  import { StripeCheckout } from '@vue-stripe/vue-stripe';
  export default {
    name: 'PaymentPage',
    components: {
      StripeCheckout,
    },
    data () {
      return {
        isLoading:false,
        publishableKey:'env',
        loading: false,
        lineItems: [
          {
            price: 'env', // The id of the one-time price you created in your Stripe dashboard
            quantity: 1,
          },
        ],
        successURL: 'http://localhost:8080/success',
        cancelURL: 'http://localhost:8080/cancel',
      };
    },
    methods: {
      submit () {
        // You will be redirected to Stripe's secure checkout page
        this.$refs.checkoutRef.redirectToCheckout();
        this.isLoading = true;
      },
    },
  };
  </script>