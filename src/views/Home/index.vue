<template>
  <div class="home-page-container h-full overflow-y-auto overflow-x-hidden">
    <div class="home-page font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex-shrink-0 flex items-center space-x-2">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-extrabold text-xl">U</span>
            </div>
            <span class="text-2xl font-black tracking-tighter uppercase italic">UniSpace</span>
          </div>
          <div class="hidden md:flex flex-1 max-w-md mx-8">
            <div class="relative w-full">
              <input class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary transition-all" placeholder="Search custom designs..." type="text"/>
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
            </div>
          </div>
          <nav class="hidden lg:flex items-center space-x-8 text-sm font-semibold uppercase tracking-wide">
            <a class="hover:text-primary transition-colors" href="#">Uniforms</a>
            <a class="hover:text-primary transition-colors" href="#" @click.prevent="goToEditor()">Design Tool</a>
            <a class="hover:text-primary transition-colors" href="#">Promos</a>
            <a class="hover:text-primary transition-colors" href="#">Support</a>
          </nav>
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <span class="material-symbols-outlined">shopping_cart</span>
            </button>
            <button class="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-primary/25" @click="goToEditor()">
              Start Designing
            </button>
          </div>
        </div>
      </div>
    </header>

    <section class="relative overflow-hidden pt-10 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="hero-gradient rounded-3xl p-8 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center">
          <div class="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-[120px] opacity-20 -mr-48 -mt-48"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-[120px] opacity-10 -ml-48 -mb-48"></div>
          <div class="lg:w-1/2 z-10 text-center lg:text-left">
            <span class="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              New Semester Collection 2024
            </span>
            <h1 class="text-5xl lg:text-7xl font-black text-white leading-tight mb-8">
              YOUR STYLE,<br/>
              <span class="text-accent italic">YOUR RULES.</span>
            </h1>
            <p class="text-white/80 text-lg mb-10 max-w-lg mx-auto lg:mx-0">
              Create high-quality custom apparel for your squad. Premium fabrics, bold prints, and AI-powered design tools.
            </p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <button class="bg-white text-primary px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-slate-50 transition-all flex items-center justify-center" @click="goToEditor()">
                <span class="material-symbols-outlined mr-2">brush</span>
                DESIGN NOW
              </button>
              <button class="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-white/10 transition-all">
                VIEW GALLERY
              </button>
            </div>
          </div>
          <div class="lg:w-1/2 mt-12 lg:mt-0 relative flex justify-center items-center">
            <div class="relative group">
              <div class="absolute inset-0 bg-accent rounded-2xl rotate-3 group-hover:rotate-6 transition-transform"></div>
              <img alt="Premium Oversized Tee" class="relative z-10 w-full max-w-md rounded-2xl shadow-2xl transition-transform hover:-translate-y-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAROH3hjWWNUzgKmEcRnLl0BYDcUcGkvjWchqyNiJQRKM5eOWfehQ9j_7_OHciZWB-76l3izCH2CDVMSUnPuV3YLYA1KJv-HbzgJoQbG2tmiQdPXPUvIPyY2NowpHMrPv-D5aEMlN9oGfwGBVvLZM4UsPNzMPKp_3mwftqmjaqCfFjiPNQlWcx1cNCOzbcYZmIn9A5gjHsTrk81P8Qo26hqR6CY9wPYfI-jUkNpxBEmNiIBAdfST6f8a7B5giyULBXJG6rJzQKsXF4"/>
              <div class="absolute -top-6 -right-6 z-20 bg-accent text-white w-20 h-20 rounded-full flex items-center justify-center font-black rotate-12 text-center text-xs p-2 leading-tight border-4 border-white">
                BEST SELLER
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marquee Section -->
    <div class="bg-primary py-4 overflow-hidden border-y border-white/10">
      <div class="marquee flex space-x-12 items-center">
        <span class="text-white font-black uppercase text-2xl opacity-80">FREE SHIPPING OVER $100</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <span class="text-white font-black uppercase text-2xl opacity-80">CUSTOM EMBROIDERY</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <span class="text-white font-black uppercase text-2xl opacity-80">ECO-FRIENDLY FABRICS</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <span class="text-white font-black uppercase text-2xl opacity-80">AI DESIGN ASSISTANT</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <!-- Repeat for continuous animation -->
        <span class="text-white font-black uppercase text-2xl opacity-80">FREE SHIPPING OVER $100</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <span class="text-white font-black uppercase text-2xl opacity-80">CUSTOM EMBROIDERY</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <span class="text-white font-black uppercase text-2xl opacity-80">ECO-FRIENDLY FABRICS</span>
        <span class="text-white text-2xl opacity-30">•</span>
        <span class="text-white font-black uppercase text-2xl opacity-80">AI DESIGN ASSISTANT</span>
      </div>
    </div>

    <!-- Trending Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-2">Shop Categories</h2>
            <h3 class="text-4xl font-black">TRENDING NOW</h3>
          </div>
          <a class="text-primary font-bold flex items-center hover:underline" href="#">
            View All <span class="material-symbols-outlined ml-1">arrow_forward</span>
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="group cursor-pointer">
            <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img alt="Hoodies Collection" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVvJFtRirqmEHicjGlGnlfgL5heUdt24wTESgupcUlm8RST1KXORYDfOcFPFqLVe7lAy3RTXVdSNeIfZeBW7jwo-cdUWgcRJAJjNPaKhmlNhLvOmaQk_X-0VYN1AVlJVhjZmR35QkXfpeZixl3cWi5mCLN1AAk56KOorik3YKlPWkEJjNmalXpwsD1VjjUC_oEHONEm011N2uY0rOr_ug9oZKhQmGn1iUCA0kCG3pVt74qtf47rFO1UJZsBBZF4gmOBiZ55KJRkPk"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h4 class="text-xl font-bold">Premium Hoodies</h4>
                <p class="text-sm opacity-80">24 Designs Available</p>
              </div>
            </div>
          </div>
          <div class="group cursor-pointer">
            <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img alt="T-Shirts Collection" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPB_tY6vqh-Pc-YWoImNRS-M5aXjoaZsX-27dYFlM--lXay26zrlHZvOSxB4L8cku0r819nzRn57KuKOKXIBpTaRsCxwATLifw7CMEWdk-Fr5MVFs4FYukrzwJA6i8hWAm2v-8iRi-kzN7GD9ZwcOOKPD1h7YPDpIPbZkK8lJJjx1AQoqVTS3Jg05Wh1WeCPcgOYTGciP4ivjVH4VSaNYNMYPmh_7PwnMaqwa4jOrVIJ-tOYAcqYSuTGHR59x1xXgB_y6Br0LylrQ"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h4 class="text-xl font-bold">Oversized Tees</h4>
                <p class="text-sm opacity-80">48 Designs Available</p>
              </div>
            </div>
          </div>
          <div class="group cursor-pointer">
            <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img alt="Denim Collection" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVD-5me0LBDw5tAwc8q_3l5uY-PFpXq7nBV_wF6XUgnGwu7Z5Oz3fwwJL--aktF714jtf2WJdbbaAVDooSFybz5ZxbZ9FE1GVbsRFmEjx_Uz0ZnH97-6uXRJ7SjhMPOxV0jamutm7TsIyNHxZqUDOLX8RMWHaRGQdFU5s8SzHFbNyXVPYF6xddkswyO_GO--XgpkQm5pOhwDvJEziunKZ9ijBjVWRERoVIVJg4OW4q1Nyr-CTHWEEDcmFylmwO4MBk5quqOHeFGkI"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h4 class="text-xl font-bold">Street Bottoms</h4>
                <p class="text-sm opacity-80">12 Designs Available</p>
              </div>
            </div>
          </div>
          <div class="group cursor-pointer">
            <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img alt="Accessories Collection" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT4uZ8Fpm3poEAw_99tz8bT6o0ClV5NyJDlH1XxMJhBzYU80ZQwiAkt3Mb57C1YjEro3sPulc-HqJoaDCe6bpcglYDNniXPQEBwklqKURTk5jIvZf965O7paYPz6a3LXYjh-xLJsKuzu7ITPZI4JiDieUSXSYvDpQe4o7p2jgQSVodoP3a0zwnI0XgImtkobV6coA8pgSkogJ5cB3KDqbDZS6CMQ9ayNnuYGX0qkVZBueFpEaaEMB1Uodcsz-ZaLfhUKW1dLisL3M"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h4 class="text-xl font-bold">Accessories</h4>
                <p class="text-sm opacity-80">16 Designs Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Design Experience -->
    <section class="bg-slate-50 dark:bg-slate-900/50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="relative">
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border-4 border-primary">
              <div class="flex items-center justify-between mb-8">
                <div class="flex space-x-2">
                  <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">UniSpace Design Tool v2.0</span>
              </div>
              <div class="bg-slate-100 dark:bg-slate-900 rounded-xl aspect-square flex items-center justify-center relative overflow-hidden">
                <img alt="Design Tool Interface" class="w-2/3 transform -rotate-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4x-Qnsln9KhTQBM3oX56Hjnhu01FHPI6EN2nFJkopZk7IEisJvo32pf1ZF708OAsRqGxt5ufN9W955D23RuQDEkXLhC5TM2BVDYNmVU9wMCKMeRiuCnx_2l6EbRgI3dTxSXxaN1TOAGyo1E6l0Mps0t23uhB9mvWtSw9IzOz93bt_jGYmzadpQeuiNkrjvno0dY3aGQ0rdTylMKESunSvEwpTerWk5NQ7KYt03r52vZuiC1bQxZyTnkQYz_nWWCNjos0t2jYjU6A"/>
                <div class="absolute top-4 left-4 glass-effect p-3 rounded-lg shadow-lg">
                  <div class="flex items-center space-x-2 mb-2">
                    <div class="w-6 h-6 bg-primary rounded-full"></div>
                    <div class="w-6 h-6 bg-accent rounded-full"></div>
                    <div class="w-6 h-6 bg-slate-300 rounded-full"></div>
                  </div>
                  <p class="text-[10px] font-bold">Pick Color</p>
                </div>
                <div class="absolute bottom-8 right-8 glass-effect p-4 rounded-xl shadow-xl">
                  <span class="material-symbols-outlined text-primary mb-2">format_size</span>
                  <p class="text-xs font-bold">Add Custom Text</p>
                </div>
              </div>
            </div>
            <div class="absolute -top-10 -left-10 w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center animate-bounce">
              <span class="material-symbols-outlined text-accent text-4xl">ink_pen</span>
            </div>
            <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center rotate-12">
              <span class="material-symbols-outlined text-primary text-5xl">auto_fix_high</span>
            </div>
          </div>
          <div>
            <h2 class="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">The Custom Experience</h2>
            <h3 class="text-5xl font-black mb-8 leading-tight">CRAFT YOUR UNIQUE VIBE</h3>
            <div class="space-y-8">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <h4 class="text-xl font-bold mb-2">1. Choose Your Base</h4>
                  <p class="text-slate-500 dark:text-slate-400">Select from our range of premium heavyweight cotton tees, oversized hoodies, or vintage-wash sweats.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined">palette</span>
                </div>
                <div>
                  <h4 class="text-xl font-bold mb-2">2. Customize & Refine</h4>
                  <p class="text-slate-500 dark:text-slate-400">Upload your artwork, use our built-in graphics library, or let our AI generate a unique concept for you.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h4 class="text-xl font-bold mb-2">3. Ship to Your Door</h4>
                  <p class="text-slate-500 dark:text-slate-400">We print with eco-friendly inks and ship within 48 hours. Fast, reliable, and premium quality.</p>
                </div>
              </div>
            </div>
            <button class="mt-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform" @click="goToEditor()">
              LAUNCH DESIGNER
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-950 text-white pt-20 pb-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-[6rem] md:text-[12rem] font-black tracking-tighter uppercase italic opacity-10 select-none leading-none">UNISPACE</h2>
          <div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 mt-[-2rem] md:mt-[-4rem]">
            <a class="text-xl font-bold hover:text-primary" href="#">Shop</a>
            <a class="text-xl font-bold hover:text-primary" href="#" @click.prevent="goToEditor()">Designer</a>
            <a class="text-xl font-bold hover:text-primary" href="#">Bulk Order</a>
            <a class="text-xl font-bold hover:text-primary" href="#">Gallery</a>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-16 mb-16">
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center space-x-2 mb-6">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-white font-extrabold text-sm">U</span>
              </div>
              <span class="text-xl font-black tracking-tighter uppercase italic">UniSpace</span>
            </div>
            <p class="text-slate-400 text-sm leading-relaxed">Defining the next generation of campus and street fashion. Locally crafted, globally inspired.</p>
          </div>
          <div>
            <h5 class="font-bold mb-6 uppercase tracking-widest text-xs">Help</h5>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a class="hover:text-white transition-colors" href="#">Order Status</a></li>
              <li><a class="hover:text-white transition-colors" href="#">Shipping Policy</a></li>
              <li><a class="hover:text-white transition-colors" href="#">Returns & Exchanges</a></li>
              <li><a class="hover:text-white transition-colors" href="#">Size Guide</a></li>
            </ul>
          </div>
          <div>
            <h5 class="font-bold mb-6 uppercase tracking-widest text-xs">Company</h5>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a class="hover:text-white transition-colors" href="#">About Us</a></li>
              <li><a class="hover:text-white transition-colors" href="#">Careers</a></li>
              <li><a class="hover:text-white transition-colors" href="#">Sustainability</a></li>
              <li><a class="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 class="font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h5>
            <p class="text-slate-400 text-sm mb-4">Get the latest drops and design tips.</p>
            <div class="flex">
              <input class="bg-white/5 border-white/10 rounded-l-lg py-2 px-4 w-full focus:ring-primary" placeholder="Email" type="email"/>
              <button class="bg-primary px-4 rounded-r-lg">
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs border-t border-white/5 pt-8">
          <p>© 2024 UNISPACE CUSTOMS. ALL RIGHTS RESERVED.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a class="hover:text-white" href="#">Instagram</a>
            <a class="hover:text-white" href="#">TikTok</a>
            <a class="hover:text-white" href="#">Twitter</a>
            <a class="hover:text-white" href="#">Discord</a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/store'

const mainStore = useMainStore()

const goToEditor = () => {
  mainStore.setHomeState(false)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');



.glass-effect {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-gradient {
  background: linear-gradient(135deg, #7C3AED 0%, #C026D3 100%);
}

.marquee {
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Material Symbols sizing */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
