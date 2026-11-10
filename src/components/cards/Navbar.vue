<template>
    <header class="navbar">
        <div class="navbar__inner">
        <a href="#" class="navbar__logo">
            Mor<span>gorn</span>
        </a>

        <button class="navbar__login-btn" @click="toggle">
            <v-icon small class="mr-1">mdi-account-circle-outline</v-icon>
            {{ user ? user : 'Login' }}
        </button>
        </div>

    </header>
</template>

<script>
export default {
    name: 'AppNavbar',
    data: () => ({
        email: '',
        password: '',
        user: '',
    }),
    methods: {
        toggle() {
            if (this.user) {
                this.user = ''
            } else {
                this.$refs.dlg.showModal()
            }
        },
        submit() {
            this.user = this.email.split('@')[0]
            this.email = ''
            this.password = ''
            this.$refs.dlg.close()
        },
    },
}
</script>

<style scoped src="../../assets/style/components/Navbar.css"></style>
