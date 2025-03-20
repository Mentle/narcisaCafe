// Global state
const state = {
    currentScreen: 'welcome-screen',
    customerPhoto: null,
    customerName: '',
    selectedCoffee: null,
    selectedCoffeeOptions: {
        milk: null,
        extras: []
    },
    selectedDrink: null,
    selectedDrinkOptions: {
        ice: null,
        sweetness: null
    },
    cart: [],
    doodle: null,
    orderNumber: null
};

// DOM elements - will be initialized in the initialize function
let screens;
let beginOrderBtn;
let takePhotoBtn;
let retakePhotoBtn;
let confirmIdentityBtn;
let cameraPreview;
let photoCanvas;
let capturedPhoto;
let customerNameInput;
let photoConfirmation;
let menuItems;
let coffeeCustomization;
let drinkCustomization;
let milkOptions;
let extraOptions;
let iceOptions;
let sweetnessOptions;
let addToCartBtn;
let cartItems;
let cartTotal;
let checkoutBtn;
let checkoutItems;
let checkoutTotal;
let addTipBtn;
let tipContainer;
let drawingCanvas;
let clearDrawingBtn;
let confirmOrderBtn;
let receiptPhoto;
let receiptName;
let receiptItemsList;
let receiptDoodle;
let downloadReceiptBtn;
let newOrderBtn;
let authorizeButton;

// New elements for improved navigation
let tabButtons;
let backToMenuBtn;
let backToMenuFromDrinkBtn;
let selectedCoffeeName;
let selectedDrinkName;
let customerNameDisplay;
let customerPhotoSmall;

// Cart modal elements
let cartIcon;
let cartCounter;
let cartModal;
let closeModal;

// Drawing variables
let isDrawing = false;
let drawingContext = null;

// Track touch position
let lastX = 0;
let lastY = 0;
let currentColor = '#000000'; // Default drawing color

import { GOOGLE_CONFIG } from './config.js';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    // Initialize DOM elements
    screens = document.querySelectorAll('.screen');
    beginOrderBtn = document.getElementById('begin-order-btn');
    takePhotoBtn = document.getElementById('take-photo-btn');
    retakePhotoBtn = document.getElementById('retake-photo-btn');
    confirmIdentityBtn = document.getElementById('confirm-identity-btn');
    cameraPreview = document.getElementById('camera-preview');
    photoCanvas = document.getElementById('photo-canvas');
    capturedPhoto = document.getElementById('captured-photo');
    customerNameInput = document.getElementById('customer-name');
    photoConfirmation = document.getElementById('photo-confirmation');
    menuItems = document.querySelectorAll('.menu-item');
    coffeeCustomization = document.getElementById('coffee-customization');
    drinkCustomization = document.getElementById('drink-customization');
    milkOptions = document.querySelectorAll('.option-item[data-option^="Soy"], .option-item[data-option^="Almond"], .option-item[data-option^="Oat"], .option-item[data-option^="Normal"]');
    extraOptions = document.querySelectorAll('.option-item[data-option^="Brown"], .option-item[data-option^="Honey"], .option-item[data-option^="Cinnamon"], .option-item[data-option^="Cacao"]');
    iceOptions = document.querySelectorAll('.option-item[data-option^="No Ice"], .option-item[data-option^="Light"], .option-item[data-option^="Regular Ice"], .option-item[data-option^="Extra Ice"]');
    sweetnessOptions = document.querySelectorAll('.option-item[data-option^="No Sugar"], .option-item[data-option^="Half"], .option-item[data-option^="Regular Sugar"], .option-item[data-option^="Extra Sugar"]');
    addToCartBtn = document.getElementById('add-to-cart-btn');
    cartItems = document.getElementById('cart-items');
    cartTotal = document.getElementById('cart-total');
    checkoutBtn = document.getElementById('checkout-btn');
    checkoutItems = document.getElementById('checkout-items');
    checkoutTotal = document.getElementById('checkout-total');
    addTipBtn = document.getElementById('add-tip-btn');
    tipContainer = document.getElementById('tip-container');
    drawingCanvas = document.getElementById('drawing-canvas');
    clearDrawingBtn = document.getElementById('clear-drawing-btn');
    confirmOrderBtn = document.getElementById('confirm-order-btn');
    receiptPhoto = document.getElementById('receipt-photo');
    receiptName = document.getElementById('receipt-name');
    receiptItemsList = document.getElementById('receipt-items-list');
    receiptDoodle = document.getElementById('receipt-doodle');
    downloadReceiptBtn = document.getElementById('download-receipt-btn');
    newOrderBtn = document.getElementById('new-order-btn');
    authorizeButton = document.getElementById('authorize_button');
    
    // New elements for improved navigation
    tabButtons = document.querySelectorAll('.tab-btn');
    backToMenuBtn = document.getElementById('back-to-menu-btn');
    backToMenuFromDrinkBtn = document.getElementById('back-to-menu-from-drink-btn');
    selectedCoffeeName = document.getElementById('selected-coffee-name');
    selectedDrinkName = document.getElementById('selected-drink-name');
    customerNameDisplay = document.getElementById('customer-name-display');
    customerPhotoSmall = document.getElementById('customer-photo-small');
    
    // Cart modal elements
    cartIcon = document.getElementById('cart-icon');
    cartCounter = document.getElementById('cart-counter');
    cartModal = document.getElementById('cart-modal');
    closeModal = document.querySelector('.close-modal');
    
    // Set welcome screen as active
    document.getElementById('welcome-screen').classList.add('active');
    
    // Debug screens
    console.log('Screens found:', screens.length);
    screens.forEach(screen => console.log('Screen:', screen.id));
    
    // Set up event listeners
    beginOrderBtn.addEventListener('click', () => {
        console.log('Begin order button clicked');
        navigateTo('identity-screen');
    });
    takePhotoBtn.addEventListener('click', takePhoto);
    retakePhotoBtn.addEventListener('click', retakePhoto);
    confirmIdentityBtn.addEventListener('click', confirmIdentity);
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Back to menu buttons
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            coffeeCustomization.style.display = 'none';
            document.querySelector('.menu-container').style.display = 'block';
        });
    }
    
    if (backToMenuFromDrinkBtn) {
        backToMenuFromDrinkBtn.addEventListener('click', () => {
            drinkCustomization.style.display = 'none';
            document.querySelector('.menu-container').style.display = 'block';
        });
    }
    
    // Cart icon click event
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('show');
        });
    }
    
    // Close modal event
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            cartModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => selectMenuItem(item));
    });
    
    milkOptions.forEach(option => {
        option.addEventListener('click', () => selectMilkOption(option));
    });
    
    extraOptions.forEach(option => {
        option.addEventListener('click', () => toggleExtraOption(option));
    });
    
    iceOptions.forEach(option => {
        option.addEventListener('click', () => selectIceOption(option));
    });
    
    sweetnessOptions.forEach(option => {
        option.addEventListener('click', () => selectSweetnessOption(option));
    });
    
    // Add to cart button click event
    const addToCartBtns = document.querySelectorAll('#add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    checkoutBtn.addEventListener('click', () => {
        cartModal.classList.remove('show');
        navigateTo('checkout-screen');
    });
    addTipBtn.addEventListener('click', showTipDrawing);
    clearDrawingBtn.addEventListener('click', clearDrawing);
    confirmOrderBtn.addEventListener('click', confirmOrder);
    downloadReceiptBtn.addEventListener('click', downloadReceipt);
    newOrderBtn.addEventListener('click', startNewOrder);
    authorizeButton.addEventListener('click', handleAuthClick);
    
    // Initialize camera
    initializeCamera();
    
    // Initialize drawing canvas
    initializeDrawingCanvas();
    
    // Create placeholder logo if real one doesn't exist
    createPlaceholderLogo();
    
    // Create placeholder images for menu items
    createPlaceholderImages();
    
    // Make sure customization panels are hidden by default
    if (coffeeCustomization) {
        coffeeCustomization.style.display = 'none';
    }
    
    if (drinkCustomization) {
        drinkCustomization.style.display = 'none';
    }
    
    // Initialize Google APIs
    initializeGoogleAPI();
    initializeGIS();
}

// Navigation
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the selected screen
    document.getElementById(screenId).classList.add('active');
    
    // Special actions for specific screens
    if (screenId === 'checkout-screen') {
        showCheckout();
    }
}

// Camera functions
async function initializeCamera() {
    try {
        // Check if we're running on HTTPS or localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isSecure = window.location.protocol === 'https:';
        
        if (!isLocalhost && !isSecure) {
            throw new Error('Camera access requires HTTPS or localhost for security reasons');
        }
        
        // Check if mediaDevices API is available
        if (!navigator.mediaDevices) {
            // Polyfill for older browsers
            navigator.mediaDevices = {};
        }
        
        if (!navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                
                if (!getUserMedia) {
                    throw new Error('getUserMedia is not supported in this browser');
                }
                
                return new Promise((resolve, reject) => {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }
        
        // Detect if we're on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Set up constraints based on device
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: isMobile ? 720 : 1280 },
                height: { ideal: isMobile ? 1280 : 720 }
            }
        };
        
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Make sure video element exists
        if (!cameraPreview) {
            throw new Error('Camera preview element not found');
        }
        
        // Set up video stream
        cameraPreview.srcObject = stream;
        cameraPreview.style.display = 'block';
        
        // Important: Set video element attributes
        cameraPreview.setAttribute('playsinline', ''); // Prevent fullscreen on iOS
        cameraPreview.setAttribute('autoplay', '');
        cameraPreview.setAttribute('muted', '');
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            cameraPreview.onloadedmetadata = () => {
                // Set video dimensions
                if (isMobile) {
                    // On mobile, make sure video fills the container
                    cameraPreview.style.width = '100%';
                    cameraPreview.style.height = '100%';
                    cameraPreview.style.objectFit = 'cover';
                }
                
                cameraPreview.play()
                    .then(() => {
                        console.log('Camera stream started');
                        resolve();
                    })
                    .catch(e => {
                        console.warn('Autoplay prevented:', e);
                        resolve();
                    });
            };
        });
        
        console.log('Camera initialized successfully');
    } catch (err) {
        console.error('Error accessing camera:', err);
        let errorMessage = 'Unable to access camera. ';
        
        if (err.name === 'NotAllowedError') {
            errorMessage += 'Please allow camera access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
            errorMessage += 'No camera found. Please make sure your device has a camera.';
        } else if (err.name === 'NotReadableError') {
            errorMessage += 'Camera is already in use by another application.';
        } else if (err.name === 'OverconstrainedError') {
            errorMessage += 'Camera does not meet the required constraints.';
        } else {
            errorMessage += err.message;
        }
        
        alert(errorMessage);
        
        // Show a placeholder or fallback UI
        if (cameraPreview) {
            cameraPreview.style.display = 'none';
        }
        if (capturedPhoto) {
            capturedPhoto.src = 'assets/placeholder.png';
            capturedPhoto.style.display = 'block';
        }
        if (takePhotoBtn) {
            takePhotoBtn.disabled = true;
        }
    }
}

function takePhoto() {
    try {
        if (!cameraPreview || !cameraPreview.videoWidth || !cameraPreview.srcObject) {
            throw new Error('Camera is not ready yet. Please wait a moment and try again.');
        }
        
        // Create canvas if it doesn't exist
        if (!photoCanvas) {
            photoCanvas = document.createElement('canvas');
            photoCanvas.style.display = 'none';
            document.body.appendChild(photoCanvas);
        }
        
        // Set canvas dimensions to match video
        const videoWidth = cameraPreview.videoWidth;
        const videoHeight = cameraPreview.videoHeight;
        
        // Calculate dimensions to maintain aspect ratio
        let targetWidth = 140;
        let targetHeight = 140;
        
        // Calculate the scaling factor
        const scale = Math.max(targetWidth / videoWidth, targetHeight / videoHeight);
        
        // Calculate dimensions that cover the target area while maintaining aspect ratio
        const width = videoWidth * scale;
        const height = videoHeight * scale;
        
        // Calculate cropping
        const left = (width - targetWidth) / 2;
        const top = (height - targetHeight) / 2;
        
        // Set canvas size to our target dimensions
        photoCanvas.width = targetWidth;
        photoCanvas.height = targetHeight;
        
        const context = photoCanvas.getContext('2d');
        
        // Clear the canvas
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, targetWidth, targetHeight);
        
        // Draw the video frame, cropped to center
        context.drawImage(
            cameraPreview,
            left / scale, top / scale, // Source x,y
            targetWidth / scale, targetHeight / scale, // Source width,height
            0, 0, // Destination x,y
            targetWidth, targetHeight // Destination width,height
        );
        
        // Save photo and update UI
        state.customerPhoto = photoCanvas.toDataURL('image/jpeg', 0.9);
        
        // Update all photo elements
        if (capturedPhoto) {
            capturedPhoto.src = state.customerPhoto;
            capturedPhoto.style.display = 'block';
        }
        
        // Hide camera preview and show confirmation
        if (cameraPreview) {
            cameraPreview.style.display = 'none';
            // Stop the camera stream
            const stream = cameraPreview.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
        if (takePhotoBtn) {
            takePhotoBtn.style.display = 'none';
        }
        if (retakePhotoBtn) {
            retakePhotoBtn.style.display = 'inline-block';
        }
        if (photoConfirmation) {
            photoConfirmation.style.display = 'block';
        }
        
    } catch (err) {
        console.error('Error taking photo:', err);
        alert(err.message);
    }
}

function retakePhoto() {
    // Clear the previous photo
    if (capturedPhoto) {
        capturedPhoto.style.display = 'none';
    }
    if (photoConfirmation) {
        photoConfirmation.style.display = 'none';
    }
    if (retakePhotoBtn) {
        retakePhotoBtn.style.display = 'none';
    }
    if (takePhotoBtn) {
        takePhotoBtn.style.display = 'inline-block';
    }
    
    // Reinitialize the camera
    initializeCamera();
}

function confirmIdentity() {
    if (!state.customerPhoto) {
        alert('Please take a photo first!');
        return;
    }
    
    if (!customerNameInput.value) {
        alert('Please enter your name!');
        return;
    }
    
    state.customerName = customerNameInput.value;
    
    // Update customer name display and photo in the order screen
    customerNameDisplay.textContent = state.customerName;
    customerPhotoSmall.src = state.customerPhoto;
    
    // Make sure customization panels are hidden and menu container is visible
    if (coffeeCustomization) {
        coffeeCustomization.style.display = 'none';
    }
    
    if (drinkCustomization) {
        drinkCustomization.style.display = 'none';
    }
    
    if (document.querySelector('.menu-container')) {
        document.querySelector('.menu-container').style.display = 'block';
    }
    
    navigateTo('order-screen');
}

// Menu selection
function selectMenuItem(item) {
    const itemType = item.dataset.type;
    const itemName = item.dataset.item;
    const itemPrice = parseFloat(item.dataset.price);
    
    if (itemType === 'pastry' || itemType === 'salty') {
        // Toggle selection for pastries and salty items
        item.classList.toggle('selected');
        
        // If selected, add to cart immediately
        if (item.classList.contains('selected')) {
            const menuItem = {
                name: itemName,
                type: itemType,
                price: itemPrice
            };
            
            state.cart.push(menuItem);
            updateCart();
            animateCartIcon();
        } else {
            // If deselected, remove from cart
            const index = state.cart.findIndex(cartItem => 
                cartItem.type === itemType && cartItem.name === itemName);
            
            if (index !== -1) {
                state.cart.splice(index, 1);
                updateCart();
            }
        }
    } else if (itemType === 'drink') {
        // Single selection for drinks
        menuItems.forEach(menuItem => {
            if (menuItem.dataset.type === 'drink') {
                menuItem.classList.remove('selected');
            }
        });
        
        item.classList.add('selected');
        state.selectedDrink = itemName;
        state.selectedDrinkPrice = itemPrice;
        state.selectedDrinkOptions = {
            ice: null,
            sweetness: null
        };
        
        // Reset customization options
        iceOptions.forEach(option => option.classList.remove('selected'));
        sweetnessOptions.forEach(option => option.classList.remove('selected'));
        
        // Update selected drink name in customization panel
        selectedDrinkName.textContent = itemName;
        
        // Show customization panel, hide menu container
        document.querySelector('.menu-container').style.display = 'none';
        drinkCustomization.style.display = 'block';
    } else if (itemType === 'coffee') {
        // Single selection for coffee
        menuItems.forEach(menuItem => {
            if (menuItem.dataset.type === 'coffee') {
                menuItem.classList.remove('selected');
            }
        });
        
        item.classList.add('selected');
        state.selectedCoffee = itemName;
        state.selectedCoffeePrice = itemPrice;
        state.selectedCoffeeOptions = {
            milk: null,
            extras: []
        };
        
        // Reset customization options
        milkOptions.forEach(option => option.classList.remove('selected'));
        extraOptions.forEach(option => option.classList.remove('selected'));
        
        // Update selected coffee name in customization panel
        selectedCoffeeName.textContent = itemName;
        
        // Show customization panel, hide menu container
        document.querySelector('.menu-container').style.display = 'none';
        coffeeCustomization.style.display = 'block';
    }
    
    updateCheckoutButton();
}

function selectMilkOption(option) {
    milkOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    state.selectedCoffeeOptions.milk = option.dataset.option;
}

function toggleExtraOption(option) {
    option.classList.toggle('selected');
    
    const extra = option.dataset.option;
    const index = state.selectedCoffeeOptions.extras.indexOf(extra);
    
    if (index === -1) {
        state.selectedCoffeeOptions.extras.push(extra);
    } else {
        state.selectedCoffeeOptions.extras.splice(index, 1);
    }
}

function selectIceOption(option) {
    iceOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    state.selectedDrinkOptions.ice = option.dataset.option;
}

function selectSweetnessOption(option) {
    sweetnessOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    state.selectedDrinkOptions.sweetness = option.dataset.option;
}

// Cart functions
function addToCart() {
    if (state.selectedDrink) {
        const drinkItem = {
            name: state.selectedDrink,
            type: 'drink',
            options: {
                ice: state.selectedDrinkOptions.ice,
                sweetness: state.selectedDrinkOptions.sweetness
            },
            price: state.selectedDrinkPrice
        };
        
        state.cart.push(drinkItem);
        
        // Reset drink selection
        state.selectedDrink = null;
        state.selectedDrinkOptions = {
            ice: null,
            sweetness: null
        };
    } else if (state.selectedCoffee) {
        const coffeeItem = {
            name: state.selectedCoffee,
            type: 'coffee',
            options: {
                milk: state.selectedCoffeeOptions.milk,
                extras: state.selectedCoffeeOptions.extras
            },
            price: state.selectedCoffeePrice
        };
        
        state.cart.push(coffeeItem);
        
        // Reset coffee selection
        state.selectedCoffee = null;
        state.selectedCoffeeOptions = {
            milk: null,
            extras: []
        };
    }
    
    // Reset drink and coffee selection in the UI
    menuItems.forEach(menuItem => {
        if (menuItem.dataset.type === 'drink' || menuItem.dataset.type === 'coffee') {
            menuItem.classList.remove('selected');
        }
    });
    
    // Reset customization options
    milkOptions.forEach(option => option.classList.remove('selected'));
    extraOptions.forEach(option => option.classList.remove('selected'));
    iceOptions.forEach(option => option.classList.remove('selected'));
    sweetnessOptions.forEach(option => option.classList.remove('selected'));
    
    // Hide customization panels, show menu container
    coffeeCustomization.style.display = 'none';
    drinkCustomization.style.display = 'none';
    document.querySelector('.menu-container').style.display = 'block';
    
    // Update cart display
    updateCart();
    
    // Show a brief animation on the cart icon
    animateCartIcon();
}

function animateCartIcon() {
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 300);
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    
    state.cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        let itemDescription = item.name;
        if (item.type === 'coffee' && item.options) {
            if (item.options.milk) {
                itemDescription += ` with ${item.options.milk}`;
            }
            
            if (item.options.extras.length > 0) {
                itemDescription += ` + ${item.options.extras.join(', ')}`;
            }
        } else if (item.type === 'drink' && item.options) {
            if (item.options.ice) {
                itemDescription += ` with ${item.options.ice}`;
            }
            
            if (item.options.sweetness) {
                itemDescription += ` and ${item.options.sweetness} sweetness`;
            }
        }
        
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <span>${itemDescription}</span>
                <span>€${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-item-btn" data-index="${index}">×</button>
        `;
        
        cartItems.appendChild(itemElement);
        total += item.price;
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            state.cart.splice(index, 1);
            updateCart();
        });
    });
    
    // Update cart counter
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = state.cart.length;
        
        // Hide counter if cart is empty
        if (state.cart.length === 0) {
            cartCounter.style.display = 'none';
        } else {
            cartCounter.style.display = 'flex';
        }
    }
    
    cartTotal.textContent = `€${total.toFixed(2)}`;
    
    // Enable/disable checkout button
    checkoutBtn.disabled = state.cart.length === 0;
}

function updateCheckoutButton() {
    if (state.cart.length > 0) {
        checkoutBtn.disabled = false;
    } else {
        checkoutBtn.disabled = true;
    }
}

function showCheckout() {
    // Calculate total
    let total = 0;
    state.cart.forEach(item => {
        total += item.price;
    });
    
    // Add service fee and special tax
    const serviceFee = 0.50;
    const specialTax = total * 0.10; // 10% IVA (Spanish VAT)
    
    // Display items in checkout
    checkoutItems.innerHTML = '';
    state.cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        let itemDescription = item.name;
        if (item.type === 'coffee' && item.options) {
            if (item.options.milk) {
                itemDescription += ` with ${item.options.milk}`;
            }
            
            if (item.options.extras.length > 0) {
                itemDescription += ` + ${item.options.extras.join(', ')}`;
            }
        } else if (item.type === 'drink' && item.options) {
            if (item.options.ice) {
                itemDescription += ` with ${item.options.ice}`;
            }
            
            if (item.options.sweetness) {
                itemDescription += ` and ${item.options.sweetness} sweetness`;
            }
        }
        
        itemElement.innerHTML = `
            <div>${itemDescription}</div>
            <div>€${item.price.toFixed(2)}</div>
        `;
        
        checkoutItems.appendChild(itemElement);
    });
    
    // Add service fee
    const serviceElement = document.createElement('div');
    serviceElement.className = 'checkout-item';
    serviceElement.innerHTML = `
        <div>Service Fee</div>
        <div>€${serviceFee.toFixed(2)}</div>
    `;
    checkoutItems.appendChild(serviceElement);
    
    // Add special tax
    const taxElement = document.createElement('div');
    taxElement.className = 'checkout-item';
    taxElement.innerHTML = `
        <div>IVA (10%)</div>
        <div>€${specialTax.toFixed(2)}</div>
    `;
    checkoutItems.appendChild(taxElement);
    
    // Update total
    const grandTotal = total + serviceFee + specialTax;
    checkoutTotal.textContent = `€${grandTotal.toFixed(2)}`;
}

// Show receipt screen
function showReceipt() {
    // Generate a random order number
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    state.orderNumber = orderNumber;
    
    // Get current date and time with Spanish locale
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateString = now.toLocaleDateString('es-ES', dateOptions);
    const timeString = now.toLocaleTimeString('es-ES', timeOptions);
    
    // Calculate subtotal, tax, and total
    let subtotal = 0;
    state.cart.forEach(item => {
        subtotal += item.price;
    });
    
    const tax = subtotal * 0.10; // 10% IVA (Spanish VAT)
    const total = subtotal + tax;
    
    // Generate random card last 4 digits
    const cardLast4 = Math.floor(1000 + Math.random() * 9000);
    
    // Populate receipt fields
    document.getElementById('receipt-order-number').textContent = orderNumber;
    document.getElementById('receipt-date').textContent = dateString;
    document.getElementById('receipt-time').textContent = timeString;
    document.getElementById('receipt-subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('receipt-tax').textContent = `€${tax.toFixed(2)}`;
    document.getElementById('receipt-total').textContent = `€${total.toFixed(2)}`;
    document.getElementById('receipt-card-last4').textContent = cardLast4;
    
    // Populate customer info and items
    receiptPhoto.src = state.customerPhoto || 'assets/placeholder.png';
    receiptName.textContent = `Customer: ${state.customerName}`;
    
    // Clear previous items
    receiptItemsList.innerHTML = '';
    
    // Add items to receipt
    state.cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'receipt-item';
        
        let itemDescription = item.name;
        if (item.type === 'coffee' && item.options) {
            if (item.options.milk) {
                itemDescription += ` with ${item.options.milk}`;
            }
            
            if (item.options.extras.length > 0) {
                itemDescription += ` + ${item.options.extras.join(', ')}`;
            }
        } else if (item.type === 'drink' && item.options) {
            if (item.options.ice) {
                itemDescription += ` with ${item.options.ice}`;
            }
            
            if (item.options.sweetness) {
                itemDescription += `, ${item.options.sweetness}`;
            }
        }
        
        itemElement.innerHTML = `
            <div>${itemDescription}</div>
            <div>€${item.price.toFixed(2)}</div>
        `;
        
        receiptItemsList.appendChild(itemElement);
    });
    
    // Set doodle image
    if (state.doodle) {
        receiptDoodle.src = state.doodle;
        receiptDoodle.style.display = 'block';
    } else {
        receiptDoodle.style.display = 'none';
    }
    
    // Note: Navigation to receipt-screen is now handled in confirmOrder()
}

// Drawing functions
function initializeDrawingCanvas() {
    console.log('Initializing drawing canvas with Signature Pad');
    
    // Get the canvas element
    drawingCanvas = document.getElementById('drawing-canvas');
    
    // Calculate the proper dimensions based on screen size
    const container = drawingCanvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // Set canvas height based on screen width
    let canvasHeight = 300; // Default for desktop
    
    if (window.innerWidth <= 480) {
        canvasHeight = 200; // Smaller height for phones
    } else if (window.innerWidth <= 768) {
        canvasHeight = 250; // Medium height for tablets
    }
    
    const canvasWidth = Math.min(containerWidth, 500); // Max width of 500px
    
    // Set canvas size - IMPORTANT: this must be done before initializing SignaturePad
    drawingCanvas.width = canvasWidth;
    drawingCanvas.height = canvasHeight;
    
    // Set CSS dimensions to match the canvas dimensions exactly
    drawingCanvas.style.width = canvasWidth + 'px';
    drawingCanvas.style.height = canvasHeight + 'px';
    
    // Make sure touch-action is set to none
    drawingCanvas.style.touchAction = 'none';
    
    // Initialize Signature Pad with specific options
    const signaturePad = new SignaturePad(drawingCanvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'black',
        minWidth: 2,
        maxWidth: 5,
        velocityFilterWeight: 0.2, // Lower value = smoother lines
    });
    
    // Set up color buttons
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        const color = option.dataset.color;
        
        // Set background color of the option
        option.style.backgroundColor = color;
        
        // Click event
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            signaturePad.penColor = color;
            console.log('Color changed to:', color);
        });
        
        // Touch event for mobile
        option.addEventListener('touchend', function(e) {
            e.preventDefault();
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            signaturePad.penColor = color;
            console.log('Color changed to:', color);
        });
    });
    
    // Clear button
    clearDrawingBtn.addEventListener('click', function() {
        signaturePad.clear();
        console.log('Canvas cleared');
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Save the current drawing data
        const data = signaturePad.toData();
        
        // Recalculate dimensions based on screen size
        const container = drawingCanvas.parentElement;
        const containerWidth = container.clientWidth;
        
        // Set canvas height based on screen width
        let canvasHeight = 300; // Default for desktop
        
        if (window.innerWidth <= 480) {
            canvasHeight = 200; // Smaller height for phones
        } else if (window.innerWidth <= 768) {
            canvasHeight = 250; // Medium height for tablets
        }
        
        const canvasWidth = Math.min(containerWidth, 500);
        
        // Update canvas dimensions
        drawingCanvas.width = canvasWidth;
        drawingCanvas.height = canvasHeight;
        
        // Update CSS dimensions
        drawingCanvas.style.width = canvasWidth + 'px';
        drawingCanvas.style.height = canvasHeight + 'px';
        
        // Restore the drawing
        signaturePad.fromData(data || []);
    });
    
    // Store the signature pad instance for later use
    window.signaturePad = signaturePad;
    
    console.log('Drawing canvas initialized with Signature Pad');
}

function clearDrawing() {
    // Clear the canvas
    if (window.signaturePad) {
        window.signaturePad.clear();
        console.log('Canvas cleared');
    }
}

function showTipDrawing() {
    // Hide the order summary and header
    document.querySelector('#checkout-items').style.display = 'none';
    document.querySelector('.checkout-summary').style.display = 'none';
    document.querySelector('#checkout-screen h2').style.display = 'none';
    
    addTipBtn.style.display = 'none';
    tipContainer.style.display = 'block';
    console.log('Showing tip drawing container');
    
    // Ensure the canvas is properly initialized when shown
    setTimeout(() => {
        if (window.signaturePad) {
            const data = window.signaturePad.toData();
            
            // Recalculate dimensions based on screen size
            const container = drawingCanvas.parentElement;
            const containerWidth = container.clientWidth;
            
            // Set canvas height based on screen width
            let canvasHeight = 300; // Default for desktop
            
            if (window.innerWidth <= 480) {
                canvasHeight = 200; // Smaller height for phones
            } else if (window.innerWidth <= 768) {
                canvasHeight = 250; // Medium height for tablets
            }
            
            const canvasWidth = Math.min(containerWidth, 500);
            
            // Update canvas dimensions
            drawingCanvas.width = canvasWidth;
            drawingCanvas.height = canvasHeight;
            
            // Update CSS dimensions
            drawingCanvas.style.width = canvasWidth + 'px';
            drawingCanvas.style.height = canvasHeight + 'px';
            
            // Restore the drawing if there was one
            if (data) {
                window.signaturePad.fromData(data);
            }
        }
    }, 0);
}

// Order confirmation
function confirmOrder() {
    // Save the doodle
    state.doodle = drawingCanvas.toDataURL('image/png');
    
    // Update receipt content
    showReceipt();
    
    // Navigate to receipt screen
    navigateTo('receipt-screen');
    
    // Upload receipt to Google Drive
    handleAuthClick();
}

// Receipt download
function downloadReceipt() {
    const receipt = document.getElementById('receipt');
    
    // First, ensure the receipt has the correct dimensions
    receipt.style.width = '384px'; // 4 inches at 96 DPI
    receipt.style.height = '576px'; // 6 inches at 96 DPI
    
    // Set specific dimensions for the canvas to match the receipt size
    const options = {
        width: 384, // 4 inches at 96 DPI
        height: 576, // 6 inches at 96 DPI
        scale: 2, // Higher scale for better quality
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        removeContainer: true,
        imageTimeout: 0,
        onclone: function(clonedDoc) {
            // Ensure the cloned receipt has the correct dimensions and styling
            const clonedReceipt = clonedDoc.getElementById('receipt');
            clonedReceipt.style.width = '384px';
            clonedReceipt.style.height = '576px';
            clonedReceipt.style.overflow = 'hidden';
            clonedReceipt.style.boxShadow = 'none';
            clonedReceipt.style.borderRadius = '0';
            clonedReceipt.style.margin = '0';
            clonedReceipt.style.padding = '1rem';
        }
    };
    
    // Show a loading message
    const downloadBtn = document.getElementById('download-receipt-btn');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating receipt...';
    downloadBtn.disabled = true;
    
    // Create a canvas from the receipt
    html2canvas(receipt, options).then(canvas => {
        // Convert canvas to image data URL
        const imageData = canvas.toDataURL('image/png');
        
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        downloadLink.download = `Narcisa_Receipt_${state.customerName.replace(/\s+/g, '_')}.png`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Restore button
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }).catch(error => {
        console.error('Error generating receipt:', error);
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
        alert('There was an error generating your receipt. Please try again.');
    });
}

// Start new order
function startNewOrder() {
    // Reset state
    state.customerPhoto = null;
    state.customerName = '';
    state.selectedDrink = null;
    state.selectedCoffee = null;
    state.selectedCoffeeOptions = {
        milk: null,
        extras: []
    };
    state.selectedDrinkOptions = {
        ice: null,
        sweetness: null
    };
    state.cart = [];
    state.doodle = null;
    state.orderNumber = null;
    
    // Reset UI
    customerNameInput.value = '';
    capturedPhoto.style.display = 'none';
    cameraPreview.style.display = 'block';
    takePhotoBtn.style.display = 'inline-block';
    retakePhotoBtn.style.display = 'none';
    photoConfirmation.style.display = 'none';
    
    menuItems.forEach(item => item.classList.remove('selected'));
    coffeeCustomization.style.display = 'none';
    drinkCustomization.style.display = 'none';
    milkOptions.forEach(option => option.classList.remove('selected'));
    extraOptions.forEach(option => option.classList.remove('selected'));
    iceOptions.forEach(option => option.classList.remove('selected'));
    sweetnessOptions.forEach(option => option.classList.remove('selected'));
    
    cartItems.innerHTML = '';
    cartTotal.textContent = '€0.00';
    checkoutBtn.disabled = true;
    
    addTipBtn.style.display = 'block';
    tipContainer.style.display = 'none';
    clearDrawing();
    
    // Navigate back to welcome screen
    navigateTo('welcome-screen');
}

// Helper functions
function generateRandomPrice() {
    // Generate a random price between €4.50 and €9.99
    return Math.random() * 5.5 + 4.5;
}

// Create placeholder logo and images
function createPlaceholderLogo() {
    const logoElements = document.querySelectorAll('#logo, .receipt-logo');
    logoElements.forEach(logo => {
        logo.onerror = function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="%23ff6b6b"/><text x="100" y="115" font-family="Arial" font-size="40" text-anchor="middle" fill="white">Narcisa</text></svg>';
        };
    });
}

function createPlaceholderImages() {
    const menuImages = document.querySelectorAll('.menu-item img');
    
    const placeholders = {
        'Lemon Pie': '#ffeb3b',
        'Carrot Cake': '#ff9800',
        'Mini Cheesecake': '#f5f5f5',
        'Brownie': '#795548',
        'Apple Cake': '#8bc34a',
        'Croissant de Almendra': '#ffd54f',
        'Cinnamon Roll': '#d7ccc8',
        'Espresso': '#3e2723',
        'Cappuccino': '#bcaaa4',
        'Latte': '#d7ccc8',
        'Americano': '#5d4037'
    };
    
    menuImages.forEach(img => {
        const itemName = img.alt;
        const color = placeholders[itemName] || '#cccccc';
        
        img.onerror = function() {
            this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="120" viewBox="0 0 150 120"><rect width="150" height="120" fill="${color}"/><text x="75" y="65" font-family="Arial" font-size="14" text-anchor="middle" fill="white">${itemName}</text></svg>`;
        };
    });
}

// Create assets directory
function createAssetsDirectory() {
    // This is just a placeholder function since we can't create directories from JavaScript
    // In a real implementation, the assets directory would be created on the server
    console.log('Assets directory should be created on the server');
}

// Initialize Google API
function initializeGoogleAPI() {
    gapi.load('client', async () => {
        try {
            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.API_KEY,
                discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
            });
            gapiInited = true;
            maybeEnableButtons();
        } catch (err) {
            console.error('Error initializing GAPI client:', err);
        }
    });
}

// Initialize Google Identity Services
function initializeGIS() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES,
        callback: '', // Will be set later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button')?.classList.remove('hidden');
    }
}

// Handle authorization
async function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw resp;
        }
        await uploadReceiptToDrive();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

// Upload receipt to Google Drive
async function uploadReceiptToDrive() {
    try {
        // Convert receipt to image
        const receipt = document.getElementById('receipt');
        const canvas = await html2canvas(receipt, {
            scale: 2,
            backgroundColor: '#FFFFFF',
            logging: false
        });
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
        
        // Create file metadata
        const filename = `Receipt_${state.orderNumber}_${new Date().toISOString().split('T')[0]}.jpg`;
        const metadata = {
            name: filename,
            mimeType: 'image/jpeg',
            parents: [GOOGLE_CONFIG.TARGET_FOLDER_ID]
        };
        
        // Create multipart request
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);
        
        // Upload file
        const upload = await gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: { uploadType: 'multipart' },
            headers: {
                'Content-Type': 'multipart/form-data; boundary=receipt_upload'
            },
            body: form
        });
        
        console.log('Receipt uploaded successfully:', upload.result);
        alert('Receipt has been saved to Google Drive');
        
    } catch (err) {
        console.error('Error uploading to Drive:', err);
        alert('Failed to upload receipt to Google Drive. Please try again.');
    }
}
