import '../../assets/style/index.scss'
import $ from 'jquery'
import '../../includes/mixins/CategoryMenu/index'

// initialize CategoryMenu plugin with callback function
$('.J_CategoryMenu').CategoryMenu((v) => console.info(v))
