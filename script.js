document.addEventListener("DOMContentLoaded", () => {
    const browser = document.querySelector(".browser")
    const tabsContainer = document.querySelector(".tabs")
    const contentContainer = document.querySelector(".browser")
    const newTabButton = document.querySelector(".new-tab")
    const layoutToggle = document.querySelector(".layout-toggle")
  
    let tabCounter = 1
  
    function createTab() {
      tabCounter++
      const tab = document.createElement("div")
      tab.className = "tab"
      tab.dataset.tab = tabCounter
      tab.draggable = true
      tab.innerHTML = `
              <span class="drag-handle">&#9776;</span>
              <input type="text" class="tab-title" value="New Tab">
              <button class="close-tab">&times;</button>
          `
      tabsContainer.insertBefore(tab, newTabButton)
  
      const content = document.createElement("div")
      content.className = "content"
      content.dataset.content = tabCounter
      content.innerHTML = `
              <h2 class="page-title">New Tab</h2>
              <textarea class="page-content" placeholder="Paste your text here"></textarea>
              <input type="file" class="image-upload" accept="image/*">
              <div class="image-preview"></div>
          `
      contentContainer.appendChild(content)
  
      setupTabListeners(tab)
      setupContentListeners(content)
      switchTab(tab)
    }
  
    function setupTabListeners(tab) {
      const closeButton = tab.querySelector(".close-tab")
      closeButton.addEventListener("click", (e) => {
        e.stopPropagation()
        closeTab(tab)
      })
  
      tab.addEventListener("click", () => {
        switchTab(tab)
      })
  
      const titleInput = tab.querySelector(".tab-title")
      titleInput.addEventListener("input", () => {
        updateTabTitle(tab)
      })
    }
  
    function setupContentListeners(content) {
      const imageUpload = content.querySelector(".image-upload")
      const imagePreview = content.querySelector(".image-preview")
  
      imageUpload.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = document.createElement("img")
            img.src = e.target.result
            imagePreview.innerHTML = ""
            imagePreview.appendChild(img)
          }
          reader.readAsDataURL(file)
        }
      })
    }
  
    function switchTab(clickedTab) {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"))
      document.querySelectorAll(".content").forEach((content) => content.classList.remove("active"))
  
      clickedTab.classList.add("active")
      const content = document.querySelector(`.content[data-content="${clickedTab.dataset.tab}"]`)
      content.classList.add("active")
  
      if (browser.classList.contains("vertical-layout")) {
        content.scrollTop = 0
      }
    }
  
    function closeTab(tab) {
      const content = document.querySelector(`.content[data-content="${tab.dataset.tab}"]`)
      tab.remove()
      content.remove()
  
      if (tab.classList.contains("active")) {
        const firstTab = document.querySelector(".tab")
        if (firstTab) {
          switchTab(firstTab)
        }
      }
    }
  
    function updateTabTitle(tab) {
      const titleInput = tab.querySelector(".tab-title")
      const content = document.querySelector(`.content[data-content="${tab.dataset.tab}"]`)
      const pageTitle = content.querySelector(".page-title")
      pageTitle.textContent = titleInput.value
    }
  
    function toggleLayout() {
      browser.classList.toggle("chrome-layout")
      browser.classList.toggle("vertical-layout")
  
      if (browser.classList.contains("vertical-layout")) {
        layoutToggle.innerHTML = '<i class="fas fa-window-maximize"></i>'
        document.querySelector(".tabs").scrollTop = 0
        setupVerticalScrolling()
      } else {
        layoutToggle.innerHTML = '<i class="fas fa-columns"></i>'
        removeVerticalScrolling()
      }
  
      // Reinitialize Sortable for the new layout
      initSortable()
    }
  
    function setupVerticalScrolling() {
      const contentContainer = document.querySelector(".vertical-layout .content.active")
      if (contentContainer) {
        contentContainer.addEventListener("scroll", handleVerticalScroll)
      }
    }
  
    function removeVerticalScrolling() {
      const contentContainer = document.querySelector(".content.active")
      if (contentContainer) {
        contentContainer.removeEventListener("scroll", handleVerticalScroll)
      }
    }
  
    function handleVerticalScroll(event) {
      const contentContainer = event.target
      const scrollPosition = contentContainer.scrollTop + contentContainer.clientHeight
      const scrollHeight = contentContainer.scrollHeight
  
      if (scrollPosition >= scrollHeight - 10) {
        const currentTab = document.querySelector(".tab.active")
        const nextTab = currentTab.nextElementSibling
  
        if (nextTab && nextTab.classList.contains("tab")) {
          switchTab(nextTab)
          nextTab.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  
    let sortableInstance = null
  
    function initSortable() {
      if (sortableInstance) {
        sortableInstance.destroy()
      }
      // Import SortableJS library here if not already included
      sortableInstance = new Sortable(tabsContainer, {
        animation: 150,
        handle: ".drag-handle",
        draggable: ".tab",
        onEnd: (evt) => {
          // Update the order of content divs to match the new tab order
          const tabs = Array.from(tabsContainer.querySelectorAll(".tab"))
          tabs.forEach((tab, index) => {
            const content = document.querySelector(`.content[data-content="${tab.dataset.tab}"]`)
            contentContainer.appendChild(content)
          })
        },
      })
    }
  
    newTabButton.addEventListener("click", createTab)
    layoutToggle.addEventListener("click", toggleLayout)
  
    // Setup initial tab
    setupTabListeners(document.querySelector(".tab"))
    setupContentListeners(document.querySelector(".content"))
  
    // Initialize Sortable
    initSortable()
  })
  
  