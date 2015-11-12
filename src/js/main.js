import reqwest from 'reqwest'
import doT from 'olado/doT'
import pageHeadHTML from './text/pageHead.html!text'
import mainHTML from './text/main.html!text'
import filterHTML from './text/filter.html!text'
import sectionHTML from './text/section.html!text'

import scrollTo from './lib/scroll-to'
import share from './lib/share'
import getQueryVariable from './lib/get-query-var'


const sheetPath = 'http://interactive.guim.co.uk/docsdata/';
const sheetKey = getQueryVariable('key');
const sheetFileType = '.json';
const sheetURL = sheetPath+sheetKey+sheetFileType;

const sectionIds = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'];
const sectionTitles = {
    'A': '1-10',
    'B': '11-20',
    'C': '21-30',
    'D': '31-40',
    'E': '41-50',
    'F': '51-60',
    'G': '61-70',
    'H': '71-80',
    'I': '81-90',
    'J': '91-100'
};

var totalCount;
var baseLum = 0.075;

var pageHeadTemplateFn = doT.template(pageHeadHTML);
var filterTemplateFn = doT.template(filterHTML);
var sectionTemplateFn = doT.template(sectionHTML);

var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function app(el, days, headInfo) {
    totalCount = days.length;
    var sectionDays = {'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [],'G': [], 'H': [], 'I': [],'J': []};
    days.forEach(day => {
        
        if ((day.hierarchy === 'M' || day.hierarchy === 'H') && (!day.imageHL )) {
             day.hierarchy = 'B';
        }
      

        if (day.videoHL) {
             day.hierarchy = 'H';
        }
        if (day.section) {
            sectionDays[day.section].push(day);
        }
    });

    

    var sectionsHTML = sectionIds.map(function (sectionId) {
        return sectionTemplateFn({
            'id': sectionId,
            'title': sectionTitles[sectionId],
            'days': sectionDays[sectionId]
        });
    }).join('');

    var sectionsEl = el.querySelector('.js-sections');
    sectionsEl.innerHTML = sectionsHTML;
    $$(sectionsEl, '.js-back-to-top').forEach(sectionEl => {
        sectionEl.addEventListener('click', evt => {
            evt.preventDefault();
            scrollTo(el.querySelector('.js-top'));
        });
    });

    setTitleColor(headInfo);

   // document.querySelector('.l-footer').style.display = 'block';

    
    
}

function setTitleColor(headInfo){
    headInfo.forEach(item => {
        if(item.Type === 'PageHeader'){
              document.getElementById("gv-pageHeading").innerHTML = item.Title;
              // document.getElementById("gv-pageHeading").style.background = baseColor;
        }
        if(item.Type === 'Section'){
              setColorScheme(setBaseColor(item.Title));
              // document.getElementById("gv-pageHeading").style.background = baseColor;
        }
    });
}

function setBaseColor(v){

    var c = "#194377";               
        
        if (v == "culture"){ c = "#951c55"}
        if (v == "comment"){ c = "#c05303"}
        if (v == "multimedia"){ c = "#484848"}
        if (v == "sport"){ c = "#1C4A00"}
  
    return c;
                        
} 

function setColorScheme(baseColor){
    document.getElementById("filterArea").style.background = baseColor;
    document.getElementById("filterAreaBG").style.background = baseColor;
    document.getElementById("featureAreaBG").style.background = ColorLuminance(baseColor, baseLum);
    document.getElementById("featureArea").style.background = ColorLuminance(baseColor, baseLum);

    
    // document.getElementById("fixedFilters").style.background = baseColor;
    // document.getElementById("fixedFiltersBG").style.background = baseColor;
    // document.getElementById("featureAreaBG").style.background = ColorLuminance(baseColor, baseLum);
    // document.getElementById("featureArea").style.background = ColorLuminance(baseColor, baseLum);

    var a = document.getElementsByClassName("dig-filters__filter__link__circle");
    [].forEach.call(a, function (item) { item.style.color = baseColor; });

    var a2 = document.getElementsByClassName('dig-days_day__number');
    [].forEach.call(a2, function (item) {  var n = parseInt(item.getAttribute('data-count')); n = (11-n); var c = ColorLuminance(baseColor, n*baseLum);  item.style.color = c; });

    var a3 = document.getElementsByClassName('dig-days__day');
    [].forEach.call(a3, function (item) {  var n = parseInt(item.getAttribute('data-count')); n = (11-n); var c = ColorLuminance(baseColor, n*baseLum);  item.style.borderTop= n+'px solid '+c });
    
    var a4 = document.getElementsByClassName('dig-days__heading');
    [].forEach.call(a4, function (item) {  var n = parseInt(item.getAttribute('data-count')); n = (11-n); var c = ColorLuminance(baseColor, n*baseLum);  item.style.color = c;});


    //border-top: 1px solid #94bfdd;

//     var color = window.getComputedStyle(
//     document.querySelector('.element'), ':before'
// ).getPropertyValue('color')
} 

function ColorLuminance(hex, lum) {
                
                hex = String(hex).replace(/[^0-9a-f]/gi, ''); // validate hex string

                if (hex.length < 6) {
                    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                }
                lum = lum || 0;
                
                // convert to decimal and change luminosity
                var rgb = "#", c, i;
                for (i = 0; i < 3; i++) {
                    c = parseInt(hex.substr(i*2,2), 16);
                    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                    rgb += ("00"+c).substr(c.length);
                }

                return rgb;
            }

export function init(el, context, config, mediator) {
    
    console.log(pageHeadHTML)

    el.innerHTML = mainHTML;

    var pageHeadEl = el.querySelector('.js-head-area');
    pageHeadEl.innerHTML = pageHeadHTML;

    var filtersHTML = sectionIds.map(function (sectionId) {
        return filterTemplateFn({'id': sectionId, 'title': sectionTitles[sectionId]});
    }).join('');

    var filtersEl = el.querySelector('.js-filters');
    filtersEl.innerHTML = filtersHTML;

    

    $$(filtersEl, '.js-filter').forEach(filterEl => {
        var sectionId = filterEl.getAttribute('data-section');
        filterEl.addEventListener('click', evt => {
            evt.preventDefault();
            scrollTo(el.querySelector('#dig-section-' + sectionId));
        });
    });

    $$(el, '.js-share').forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click', () => {
            share(network);
        });
    });

    reqwest({
        url: sheetURL,
        type: 'json',
        crossOrigin: true,
        success: resp => app(el, resp.sheets.Sheet1, resp.sheets.SheetCopy)
    });
}
