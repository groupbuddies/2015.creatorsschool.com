$(function() {
  'use strict';

  var ESCAPE_CODE = 27;
  var TAB_CODE = 9;

  var $document = $(document);
  var $nav = $('#Nav');
  var $menu = $('#Nav-menu')
  var $btn = $('#BurgerBtn');
  var $firstFocusableElement = $btn;
  var $lastFocusableElement = $('.MenuItems-item:last-child a');

  function setNavClass(event) {
    var scroll = $document.scrollTop();
    if (scroll > 100 && !$nav.hasClass('Nav--scrolled')) {
      $nav.addClass('Nav--scrolled');
    } else if (scroll <= 100 && $nav.hasClass('Nav--scrolled')){
      $nav.removeClass('Nav--scrolled');
    }
  }

  function toggleMenuWithoutPropagation(event) {
    event.preventDefault();
    toggleMenu(event);
  }

  function closeMenu(event) {
    if ($nav.hasClass('Nav--open')) {
      toggleMenu(event);
    }
  }

  function toggleMenu(event) {
    $nav.toggleClass('Nav--open');
    $btn.toggleClass('BurgerBtn--open');
    $menu.slideToggle(200, function() {
      if ($menu.css('display') == 'none') {
        $menu.removeAttr('style');
      }
    });
    setOverlayState();

    if ($nav.hasClass('Nav--open')) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', 'visible');
    }

    if ($btn.hasClass('BurgerBtn--open')) {
      $btn.trigger('menu-opened');
    } else {
      $btn.trigger('menu-closed');
    }
  }

  function setOverlayState() {
    if ($btn.hasClass('BurgerBtn--open')) {
      $btn.removeAttr('aria-labelledby');
    } else {
      $btn.attr('aria-labelledby', 'OpenMenuLabel');
    }
  }

  function setupListeners() {
    $document.on('scroll', setNavClass);
    $btn.on('click', toggleMenuWithoutPropagation);
    $nav.on('click', '.MenuItems a', closeMenu);

    $btn.on('menu-opened', function() {
      $nav.on('keydown', handleLeaveMenu);
      $lastFocusableElement.on('keydown', trapTab);
      $firstFocusableElement.on('keydown', trapShiftTab);
    });

    $btn.on('menu-closed', function() {
      $nav.off('keydown');
      $lastFocusableElement.off('keydown');
      $firstFocusableElement.off('keydown');
    });
  }

  function handleLeaveMenu(event) {
    if (event.keyCode === ESCAPE_CODE) {
      toggleMenuWithoutPropagation(event);
      $btn.focus();
    }
  }

  function trapTab(event) {
    if(event.keyCode === TAB_CODE) {
      event.preventDefault();
      $firstFocusableElement.focus();
    }
  }

  function trapShiftTab(event) {
    if(event.keyCode === TAB_CODE && event.shiftKey) {
      event.preventDefault();
      $lastFocusableElement.focus();
    }
  }

  setNavClass();
  setOverlayState();
  setupListeners();
});
