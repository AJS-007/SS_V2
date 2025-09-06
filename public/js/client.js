document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("myBtn");
  const newCraftForm = document.getElementById("new-craft-form");
  newCraftForm.style.display = "none"; //Do ti in css
  btn.addEventListener("click", () => {
    //alert("getElementById works in EJS!");
    const title = document.getElementById("title");
    newCraftForm.style.display = "block";
    title.textContent = "Button Clicked!";
    
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("register-btn");
  const sellerRegistrationForm = document.getElementById("seller-registration-form");
  sellerRegistrationForm.style.display = "none"; //Do ti in css
  btn.addEventListener("click", () => {
    //alert("getElementById works in EJS!");
    const title = document.getElementById("title");
    sellerRegistrationForm.style.display = "block";
    title.textContent = "Button Clicked!";
    
  });
});


// Hide login link if on /auth/login (login page)
  if (window.location.pathname === '/auth/login') {
    const loginLink = document.getElementById('nav-login');
    if (loginLink) {
      loginLink.style.display = 'none';
    }
  }

// Hide signup link if on /auth/signup (signup page)
  if (window.location.pathname === '/auth/signup') {
    const signupLink = document.getElementById('nav-signup');
    if (signupLink) {
      signupLink.style.display = 'none';
    }
  }
