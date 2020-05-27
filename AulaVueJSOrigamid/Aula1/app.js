const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        carrinhoAtivo: false,
        mensagemAlerta: "Item adicionado",
        alertaAtivo: false,
    },
    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
        }
    },
    computed:{
        carrinhoTotal(){
            let total = 0;
            if(this.carrinho.length){
                this.carrinho.forEach(item => {
                    total += item.preco;
                })
            }
            return total;
        }
    },
    methods: {
        // returnProdutos() {
        //     fetch("http://localhost:3002/api/products")
        //         .then(r => r.json())
        //         .then(r => {
        //             this.produtos = r;
        //         })
        // },
        // botaProdutos() {
        //     fetch("http://localhost:3002/api/products", {
        //         method: 'POST', body: JSON.stringify({
        //             nome: this.nome,
        //             preco: this.preco,
        //             img: this.img
        //         }),
        //         headers: {
        //             "Content-type": "application/json; charset=UTF-8"
        //         }
        //     })
        //         .then(r => r.json())
        //         .then(r => {
        //             console.log(r)
        //         });
        // }
        fetchProdutos() {
            fetch("./apip/produtos.json")
                .then(r => r.json())
                .then(r => {
                    this.produtos = r;
                })
        },
        fetchProduto(id) {
            fetch(`./apip/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {    
                    this.produto = r;
                });
        },
        abrirModal(id){
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })

        },
        fecharModal(event){
            if(event.target === event.currentTarget){
                this.produto = false;
            };
        },
        clickForaCarrinho(event){
            if(event.target === event.currentTarget){
                this.carrinhoAtivo = false;
            };
        },
        adicionarItem(){
            this.produto.estoque--;
            const {id,nome,preco} = this.produto
            this.carrinho.push({id,nome,preco})
            this.alerta(`${nome} adicionado ao carrinho`)

        },
        removerItem(index){
            this.carrinho.splice(index,1)
        },
        checarLocalStorage(){
            if(window.localStorage.carrinho){
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        compararEstoque(){
            const items = this.carrinho.filter(item => {
                if(item.id === this.produto.id){
                    return true;
                }
            })
            this.produto.estoque = this.produto.estoque - items.length;
        },
        alerta(mensagem){
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false
            }, 1500);
        },
        router(){
            const hash = document.location.hash;
            if(hash){
                this.fetchProduto(hash);
            }
        }

    },
    watch: {
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        },
        produto(){
            document.title = this.produto.nome || "Techno"
            const hash = this.produto.id || "";
            history.pushState(null,null, `#${hash.replace("#", "")}`)
        }
    },
    created() {
        this.fetchProdutos();
        this.checarLocalStorage();
        this.router();
    }
})