function fileClosure() {
  
  const page = document;
  
  function elem(selector, parent = document){
    let elem = document.querySelector(selector);
    return elem != false ? elem : false;
  }
  
  function elems(selector) {
    let elems = document.querySelectorAll(selector);
    return elems.length ? elems : false; 
  }
  
  function pushClass(el, targetClass) {
    // equivalent to addClass
    if (el && typeof el == 'object' && targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? false : elClass.add(targetClass);
    }
  }
  
  function deleteClass(el, targetClass) {
    // equivalent to removeClass
    if (el && typeof el == 'object' && targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
    }
  }
  
  function modifyClass(el, targetClass) {
    // equivalent to toggleClass
    if (el && typeof el == 'object' && targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
    }
  }
  
  function containsClass(el, targetClass) {
    if (el && typeof el == 'object' && targetClass) {
      return el.classList.contains(targetClass) ? true : false;
    }
  }

  function createEl(element = 'div') {
    return document.createElement(element);
  }
  
  (function decorateContacts() {
    let contacts = elems('.contact');
    if (contacts) {
      contacts.forEach(contact => {
        let icons = contact.querySelectorAll('img');
        icons.forEach(icon => {
          let heading = icon.parentNode;
          pushClass(heading, 'contact_decorate');
          pushClass(icon, 'contact_icon');
        }); 
      });
    }
  })();
  
  (function() {
    let items = elems('.share_item');
    
    (function shareItem() {
      const copyToClipboard = str => {
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';                 
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =            
        document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
          document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
          document.getSelection().addRange(selected);   // Restore the original selection
        }
        const copyText = document.createElement('div');
        copyText.classList.add('share_copy');
        copyText.innerText = 'Link Copied';
        // check if there's another notification
        let shareItems = Array.from(elem('.share').children);
        let shareLength = shareItems.length;
        let lastIndex = shareLength - 1;
        let lastShareItem = shareItems[lastIndex];
        if(lastShareItem.classList.contains('share_copy') == false) {
          elem('.share').appendChild(copyText);
          setTimeout(function() { 
            elem('.share').removeChild(copyText)
          }, 4000);
        }
      };
      
      elem('main').addEventListener('click', function(event) {
        let shareTrigger = event.target.closest('.share_item');
        if(shareTrigger) {
          let copyclass = shareTrigger.classList.contains('copy') ? true : false;
          let shareSrc = shareTrigger.href;
          event.preventDefault();
          if(copyclass) {
            copyToClipboard(shareSrc);
          } else {
            window.open(shareSrc, 'mywin','left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
          }
        }
      });
    })();
  })();
  
  (function autoResizeTextField() {

    let textFields = elems('textarea');
    if (textFields) {
      textFields.forEach(function(textField){
        autosize(textField);
      })
    }
  })();
  
  // Replaces bootstrap carousel
  (function Slider() {
    function activateSlide(el, position, direction) {
      let allSlides = Array.from(el);
      let active = 'slide_active';
      let rest = 'slide_rest';
      let activeSlide = allSlides.filter((slide) => {
        return slide.classList.contains(active);
      })[0];
      
      let currentPosition = allSlides.indexOf(activeSlide);
      // number of slides 
      let size = allSlides.length;
      
      function switchDot(position) {
        let active = 'dot_active';
        let dots = Array.from(activeSlide.parentNode.nextElementSibling.children);
        let activeDot = dots[currentPosition]; 
        let targetDot = dots[position];
        deleteClass(activeDot, active);
        pushClass(targetDot, active);
      }
      
      function switchSlide (position) {
        let targetSlide = allSlides[position];
        switchDot(position);
        deleteClass(activeSlide, active);
        pushClass(activeSlide, rest);
        setTimeout(function(){
          deleteClass(activeSlide, rest);
        }, 1000)
        pushClass(targetSlide, active);
      }
      
      function arrows() {
        // Get the position of the active Slide
        if(direction === 1) {
          if(currentPosition >= 0 && currentPosition !== (size - 1)) {
            let position = (currentPosition + 1);
            switchSlide(position);
          } else {
            let position = 0;
            switchSlide(position);
          }
        } else {
          if(currentPosition !== 0) {
            let position = (currentPosition - 1);
            switchSlide(position);
          } else {
            let position = (size - 1);
            switchSlide(position);
          }
        }
      }
      
      function dots() {
        switchSlide(position);
      }
      
      position === undefined ? arrows() : dots();
      
    }
    
    let mainSection = document.querySelector('main');
    
    mainSection.addEventListener('click', function(event) {
      let dot = event.target.closest('.dot');
      let direction = event.target.closest('.direction');
      let left = event.target.closest('.slide_left');
      let right = event.target.closest('.slide_right');
      
      if (dot) {
        let dots = dot.parentNode.children;
        let slides = dot.parentNode.previousElementSibling.children;
        let position = Array.from(dots).indexOf(dot);
        activateSlide(slides, position, undefined);
      }
      
      if(left || right) {
        let slides = direction.previousElementSibling.previousElementSibling.children;
        left ? activateSlide(slides, undefined, 0) : right ? activateSlide(slides, undefined, 1) : false ;
      }
    });
    
    mainSection.addEventListener('keydown', function(event) {
      let slides = Array.from(event.target.children);
      let isSlides = event.target.closest('.slides_container');
      if(slides && isSlides) {
        let direction = event.code.toLowerCase() === 'arrowleft' ?  0 : (event.code.toLowerCase()  === 'arrowright' ? 1 : undefined); 
        if (direction !== undefined ) {
          direction === 0 ? activateSlide(slides, undefined, 0) : activateSlide(slides, undefined, 1) ;
        }
      }
    });
    
    function autoPlaySlide (speed) {
      window.setInterval(function() {
        let sliders = Array.from(document.querySelectorAll('.slides'));
        if(sliders) {
          sliders.forEach((slider) => {
            activateSlide(slider.children, undefined, 1);
          });
        }
      }, speed);
    }
    
    autoPlaySlide(7000);  
    
  })();
  
  function smoothScroll(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;
    
    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollTo(element, to, duration - 10);
    }, 10);
  }
  
  (function showContacts() {
    let contact = document.querySelector('#contact');
    let contactButton = document.querySelector('.contact_btn');
    if(contactButton) {
      contactButton.addEventListener('click', function() {
        contact ? smoothScroll(document.body, contact.offsetTop, 600) : false;
      });
    }
  })();
  
  function populateAlt(images) {
    images.forEach((image) => {
      if (image.alt.length > 10 && !containsClass(image, 'alt')) {
        let desc = document.createElement('p');
        desc.classList.add('thumb_alt');
        desc.textContent = image.alt;
        image.insertAdjacentHTML('afterend', desc.outerHTML);
      }
    });
  }
  
  // (function AltImage() {
  //   let post = elem('main');
  //   let images = post ? post.querySelectorAll('img') : false;
  //   images ? populateAlt(images) : false;
  // })();
  
  (function updateDate() {
    var date = new Date();
    var year = date.getFullYear();
    elem('.year').innerHTML = year;
  })();
  
  (function menu() {
    let button, drop, fancy, main, menu, open, top;
    button = 'nav_toggle';
    drop = 'nav_xs';
    fancy = 'nav_fancy';
    open = 'open';
    
    main = elem('main');
    menu = elem('.nav_menu');
    top = elem('.nav_top');
    
    function modifyMenu() {
      modifyClass(main, open); 
      modifyClass(menu, fancy); 
      modifyClass(top, drop);
    }
    
    page.addEventListener('click', function(event) {
      let target = event.target;
      let isOnContent = target.closest(`.${open}`);
      let isOnButton = target.closest(`.${button}`) || containsClass(target, button);
      isOnContent && !isOnButton ? modifyMenu() : false;
      isOnButton  ? modifyMenu() : false;
    });
    
    let fixed, nav, scroll;
    
    fixed = 'nav_fixed';
    scroll = 'nav_scroll';
    nav = elem('.nav_wrap');
    
    function animateNav() {
      !containsClass(nav, scroll) ? pushClass(nav, scroll) : false;
      setTimeout(function(){
        !containsClass(nav, fixed) ? pushClass(nav, fixed) : false;
      }, 500)
    }
    
    function restoreNav() {
      containsClass(nav, scroll) ? deleteClass(nav, scroll) : false;
      setTimeout(function(){
        containsClass(nav, fixed) ? deleteClass(nav, fixed) : false;
      }, 500)
    }
    
    function fixNav() {
      window.addEventListener('scroll', function(e) {
        let position = window.scrollY;
        if (position > 200) {
          window.requestAnimationFrame(animateNav); 
        } else {
          window.requestAnimationFrame(restoreNav); 
        }
      });
    }
    nav ? fixNav() : false;
    
  })();
  
  let panels = elems('.panel');
  
  function newSlides() {
    // cycle manually
    // if manually, cycle on both directions
    // set time interval
    // pause time interval if manual
    // resume time interval after manual
    let left = 'panel_left';
    let control = 'panel_control';
    let panelContainer = elem('.panels');
    let firstPanel = panels[0]
    let countPanels = Array.from(panels).length;
    let lastPanel = panels[countPanels - 1];
    
    function switchPanel(direction = true) {
      // direction is true if manual click is to the right ... else it's false
      let activePanel = elem('.panel_active', panels);
      let nextPanel = activePanel.nextElementSibling
      let previousPanel = activePanel.previousElementSibling;
      let newPanel = Object.create(null);
      if (direction) {
        newPanel = nextPanel ? nextPanel : firstPanel;
      }
      if (!direction) {
        newPanel = previousPanel ? previousPanel : lastPanel;
      }
      deleteClass(activePanel, 'panel_active');
      pushClass(newPanel, 'panel_active')
    }
    
    let automaticSwitch = window.setInterval(function(){
      switchPanel();
    }, 7500)
    
    panelContainer.addEventListener('click', function(event) {
      let target = event.target;
      let isControl = containsClass(target, control)
      if(isControl) {
        let isLeft = containsClass(target, left);
        isLeft ? switchPanel(false) : switchPanel();
        clearInterval(automaticSwitch);
        automaticSwitch = window.setInterval(function(){
          switchPanel();
        }, 7500)
      }
    });
    
  }
  
  panels ? newSlides() : false;
  
  function countries(list, node) {
    list.forEach(function(country){
      let option = document.createElement('option');
      option.textContent = country;
      option.value = country;
      node.appendChild(option);
    });
  }
  
  (function populateOptions() {
    let field = elem('.form_country');
    field ? countries(formCountries, field) : false;
  })();
  
  function formFeedBack(parent, success = false) {
    let bold, modal, icon, clipBoard, title, message, messages;
    messages = {
      success: {
        title: "Message sent!",
        message: "Thank you for contacting us. You'll hear from us soon.",
        icon: "icon-success.png"
      },
      failure: {
        title: "Something's wrong ...",
        message: "<a href = 'mailto:info@expeditions.co.ke'<u>Contact us</u></a> directly and we'll get you set up in no time.",
        icon: "icon-failure.png"
      }
    }
    let feedback = success ? messages.success : messages.failure;
    let modalClass = 'modal';
    
    modal = createEl();
    modal.className = modalClass;
    clipBoard = createEl();
    title = createEl('h3');
    title.textContent = feedback.title;
    bold = createEl('strong');
    bold.innerHTML = feedback.message;
    message = createEl('p')
    message.appendChild(bold);
    icon = createEl('img');
    icon.src = `/icons/${feedback.icon}`;
    icon.className = 'modal_icon';
    
    clipBoard.appendChild(icon);
    clipBoard.appendChild(title);
    clipBoard.appendChild(message);
    modal.appendChild(clipBoard);
    
    // append modal only once
    // parent node
    let node = parent.parentNode;
    let children = node.children;
    let hasModal = containsClass(children[children.length - 1], modalClass);
    
    if (!hasModal) {
      node.appendChild(modal);
      window.scrollTo(0, 201);
    } 
    
  }

  function formValues(form) {
    const isValidElement = element => {
      return element.name && element.value;
    };
    
    const isValidValue = element => {
      return (!['checkbox', 'radio'].includes(element.type) || element.checked);
    };
    
    const isCheckbox = element => element.type === 'checkbox';
    const isMultiSelect = element => element.options && element.multiple;
    
    const getSelectValues = options => [].reduce.call(options, (values, option) => {
      return option.selected ? values.concat(option.value) : values;
    }, []);
    
    const formToJSON = elements => [].reduce.call(elements, (data, element) => {
      if (isValidElement(element) && isValidValue(element)) {
        if (isCheckbox(element)) {
          data[element.name] = (data[element.name] || []).concat(element.value);
        } else if (isMultiSelect(element)) {
          data[element.name] = getSelectValues(element);
        } else {
          data[element.name] = element.value;
        }
      }
      let referrer = document.referrer;
      referrer ? data.from  = referrer : "self";
      return data;
    }, {});
    
    const data = formToJSON(form.elements);
    return JSON.stringify(data, null, "  ");
  
  }
  
  function submitSignUp(form) {
    let formAction = 'https://getform.io/f/febe942a-1bbe-418e-a138-26286e9e68';

    let data = formValues(form);
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: data
    }

    fetch(formAction, options)
    .then(response => response.text())
    .then(() => {
      formFeedBack(form, true);
    })
    .catch(() => {
      formFeedBack(form)
    });
  }
  
  (function handleForm() {
    // request options
    let formID = '.form';
    let forms = elems(formID);
    
    if(forms) {
      const form = forms[0];
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitSignUp(form);
        return false;
      });
    }
  })();

  function hasNoContent(element) {
    return element.textContent.length < 1 && !element.children.length;
  }

  const paragraphs = Array.from(elems('p'));
  
  paragraphs.filter(function(paragraph) {
    hasNoContent(paragraph);
  }).forEach(function(paragraph) {
    paragraph.remove()
  });

  let hasImages = paragraphs.filter(function(p1){
    return p1.children.length;
  }).filter(function(p2) {
    let firstChild = p2.firstElementChild;
    return firstChild && firstChild.tagName.toLowerCase() == 'img'
  });

  hasImages.forEach(function(p3){
    let img = p3.firstElementChild;
    let parent = p3.parentNode;
    parent.insertBefore(img, p3)
    p3.remove();
  });

}

window.addEventListener('load', fileClosure());
