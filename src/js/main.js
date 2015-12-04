import reqwest from 'reqwest'
import doT from 'olado/doT'
import pageHeadHTML from './text/pageHead.html!text'
import metaContainerHTML from './text/metaContainer.html!text'
import mainHTML from './text/main.html!text'
import filterHTML from './text/filter.html!text'
import fixedFilterHTML from './text/fixedFilter.html!text'
import sectionHTML from './text/section.html!text'

import scrollTo from './lib/scroll-to'
import share from './lib/share'
import getQueryVariable from './lib/get-query-var'
import getDataAltVariable from './lib/get-data-alt-var'
import formatGuardianDate from './lib/format-guardian-date'

const sheetPath = 'http://interactive.guim.co.uk/docsdata/';
const sheetKey = getDataAltVariable(); //getQueryVariable('key')
const sheetFileType = '.json';
const sheetURL = sheetPath+sheetKey+sheetFileType;

var sectionIds = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'];
var sectionTitles = {
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
var sectionDays = {'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [],'G': [], 'H': [], 'I': [],'J': []};

var requiredSections;
var baseLum = 0.1;

var publishedDate;
var shortURL;
var globalTitle;

var maxSlice, minSlice;

var pageHeadTemplateFn = doT.template(pageHeadHTML);
var metaContainerFn = doT.template(metaContainerHTML);
var filterTemplateFn = doT.template(filterHTML);
var fixedFilterTemplateFn = doT.template(fixedFilterHTML);
var sectionTemplateFn = doT.template(sectionHTML);

var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function getMaxNumber(a){
    var n = 0;
    a.forEach(item => {
        if(item.displayNumber > n){ n = item.displayNumber }
    })

    return (Math.ceil(n)/10);
}

function getMinNumber(a, n){
   var k = n;
    a.forEach(item => {
        if(item.displayNumber/10 < k){ k = item.displayNumber/10 }
    })

    return (Math.floor(k));
}


function app(el, days, headInfo) {

    //set some globals 
    publishedDate = (window.guardian.config.page.webPublicationDate) ? formatGuardianDate(window.guardian.config.page.webPublicationDate) : "&nbsp;";
    shortURL = (window.guardian.config.page.shortUrl) ? (window.guardian.config.page.shortUrl) : "http://www.theguardian.com";
    requiredSections = Math.ceil(days.length/10); 

    maxSlice = getMaxNumber(days);

    minSlice = getMinNumber(days, maxSlice);

    sectionIds = sectionIds.slice(0, maxSlice);

    var k = 0;

    days.forEach(day => {
        k++;
        day.k = k; 
        if (day.YouTubeVideoKey) {
             day.Video = "https://www.youtube.com/embed/"+day.YouTubeVideoKey;
             day.hierarchy = 'H';

        }
        
        //group entries in bands of 10

        var n = getSectionRef(day.displayNumber);
        day.section = sectionIds[n];
        sectionDays[day.section].push(day);
        
    });

    var sectionsHTML = sectionIds.map(function (sectionId) {
        
        return sectionTemplateFn({
           
            'id': sectionId,
            'title': sectionTitles[sectionId],
            'days': sectionDays[sectionId],
            'showing':(sectionDays[sectionId].length === 0)

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

    $$(sectionsEl, '.atom-share').forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        var key = shareEl.getAttribute('data-count')
        shareEl.addEventListener('click', () => {
            share(network, days[key-1]);
        });
    });



    var filtersHTML = sectionIds.map(function (sectionId) { return filterTemplateFn({'id': sectionId, 'title': sectionTitles[sectionId], 'showing':(sectionDays[sectionId].length === 0)});}).join('');
      
            var filtersEl = el.querySelector('.js-filters');
            filtersEl.innerHTML = filtersHTML;

            $$(filtersEl, '.js-filter').forEach(filterEl => {
                var sectionId = filterEl.getAttribute('data-section');
                filterEl.addEventListener('click', evt => {
                    evt.preventDefault();
                    scrollTo(el.querySelector('#dig-section-' + sectionId));
                });
         });

    var fixedFiltersHTML  = sectionIds.map(function (sectionId) { return fixedFilterTemplateFn({'id': sectionId, 'title': sectionTitles[sectionId], 'showing':(sectionDays[sectionId].length === 0)});}).join('');      
        
            var fixedFiltersEl = el.querySelector('.js-filters-fixed');
            fixedFiltersEl.innerHTML = fixedFiltersHTML;

            $$(fixedFiltersEl, '.js-filter-fixed').forEach(fixedFilterEl => {
                var sectionId = fixedFilterEl.getAttribute('data-section');
                fixedFilterEl.addEventListener('click', evt => {
                    evt.preventDefault();
                    scrollTo(el.querySelector('#dig-section-' + sectionId));
                
            });   
        }); 
     var pageHeadEl = el.querySelector('.js-head-area');
        pageHeadEl.innerHTML = pageHeadHTML;
        
        setPageFurniture(headInfo);
        setPageDate();

        addScrollListener();
  
}

function addScrollListener(){
        var el = document.getElementById("fixedFilterAreaBG")

        //console.log(el.scrollTop)
        // var el = .style.display = 'none';

        
        window.onscroll=function(){ checkElScroll(el) };
}

function checkElScroll(el)
{
    
    var docViewTop = document.body.scrollTop;
    var docViewBottom = docViewTop + window.height;
    var backTop = document.getElementById("backToTop");

        if(isElementVisible(document.getElementById("featureAreaBG")))
        {
            hideElement(el);
            
            //unfixElement(backTop);
        }else{
            
            showElement(el);
            
        }

        // if(isElementVisible(document.getElementById("fixedFilterAreaBG"))){
        //     hideElement(backTop);
        // }else{
        //     fixElement(backTop);
        //     showElement(backTop);
        // }

    
}

function hideElement(el){
     el.classList.remove("showing");
     el.classList.add("hiding");

    }

function showElement(el){
     el.classList.remove("hiding");
     el.classList.add("showing");
    }

function fixElement(el){
     var fixPos = document.getElementById("fixedFilters").offsetHeight; 
     el.classList.remove("dig-slice_relative");
     el.classList.add("dig-slice_fixed");
     el.style.top = fixPos+'px';
    }

function unfixElement(el)
    {
     el.classList.remove("dig-slice_fixed");
     el.classList.add("dig-slice_relative");
    }   

function isElementVisible(el) {
    var rect = el.getBoundingClientRect(),
    vWidth = window.innerWidth || doc.documentElement.clientWidth,
    vHeight = window.innerHeight || doc.documentElement.clientHeight,
    efp = function (x, y) { return document.elementFromPoint(x, y) };     

    return(rect.height * -1 < rect.top)

        // // Return false if it's not in the viewport
        // if (rect.right < 0 || rect.bottom < 0 
        //         || rect.left > vWidth || rect.top > vHeight)
        //     return false;

        // // Return true if any of its four corners are visible
        // return (
        //       el.contains(efp(rect.left,  rect.top))
        //   ||  el.contains(efp(rect.right, rect.top))
        //   ||  el.contains(efp(rect.right, rect.bottom))
        //   ||  el.contains(efp(rect.left,  rect.bottom))
        // );
}

function getSectionRef(n){
    // subtract 1 so that 10-20-30-40-50-60-70-80-90 are in right group
    n-=1;
    var k = Math.floor(n/10);
    return k;  
}

function setPageFurniture(headInfo){

        headInfo.forEach(item => {

            if(item.Type === 'PageHeader'){
                  globalTitle = item.Title;
                  document.getElementById("gv-pageHeading").innerHTML = item.Title;
            }

            if(item.Type === 'Standfirst'){
                  document.getElementById("standfirstHolder").innerHTML = item.Copy;
            }

            if(item.Type === 'Section'){
                var s = getSubTitleHTML(item);
                console.log(s)
                document.getElementById("gvSectionSubHead").innerHTML = s;
            }

            if(item.Type === 'GlobalSection'){
                  setColorScheme(setBaseColor(item.Title));
            }

        });

}


function getSubTitleHTML(item){
    return "<a href='"+item.Link+"'>"+item.Title+"</a>";
}

function setPageDate(){
    //document.getElementById("globalDateContainer").innerHTML = publishedDate;

    var a = document.getElementsByClassName('dig-global-date-container');
        [].forEach.call(a, function (item) {  item.innerHTML = publishedDate;});

}

function setBaseColor(v){

    var c = { main:"#005689", support:"#4bc6df", link:"#ffffff" };               
        
        if (v == "culture"){ c = { main:"#951c55", support:"#b82266", link:"#fdadba" } }
        if (v == "comment"){ c = { main:"#005689", support:"#4bc6df", link:"#ffffff" } }
        if (v == "multimedia"){ c = { main:"#005689", support:"#4bc6df", link:"#ffffff" } }
        if (v == "sport"){ c = { main:"#005689", support:"#4bc6df", link:"#ffffff" } }
    
    

    return c;
                
                        
} 

function setColorScheme(c){


    var m = (String(c.main));
    var s = (String(c.support));
    var l = (String(c.link));
    document.getElementById("fixedFilterArea").style.background = s;
    document.getElementById("fixedFilterAreaBG").style.background = ColorLuminance(s, baseLum * -0.5);
    document.getElementById("filterArea").style.background =  s;
    document.getElementById("filterAreaBG").style.background = ColorLuminance(s, baseLum *  -0.5);
    document.getElementById("featureAreaBG").style.background = ColorLuminance(m, baseLum * -0.5);
    document.getElementById("featureArea").style.background = m;


    var a = document.getElementsByClassName("dig-filters__filter__link__circle");
    [].forEach.call(a, function (item) { item.style.color = m; });

    var a2 = document.getElementsByClassName('dig-days_day__number');
    [].forEach.call(a2, function (item) {  var n = parseInt(item.getAttribute('data-count')); n = (11-n); var c = ColorLuminance(s, n* 0.02);  item.style.color = c; });

    var a3 = document.getElementsByClassName('dig-days__day');
    [].forEach.call(a3, function (item) {  var n = parseInt(item.getAttribute('data-count')); n = (11-n); var c = ColorLuminance(s, n* 0.02);  item.style.borderTop=setBorderH(n)+'px solid '+c });
    
    var a4 = document.getElementsByClassName('dig-days__heading');
    [].forEach.call(a4, function (item) {  var n = parseInt(item.getAttribute('data-count')); n = (11-n); var c = ColorLuminance(s, n* 0.02);  item.style.color = c;});


} 

function setBorderH(n){
    //var m = 10/maxSlice;
 

   console.log(maxSlice, n, 10/n)
  
    var a = [0.5,0.5,0.5,0.5,0.5,1,2,4,6,8,10,14]

    console.log(n, a[n]);
 
    return a[n];
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

    el.innerHTML = mainHTML;   

    var metaEl = el.querySelector('.dig-meta-container');
    metaEl.innerHTML = metaContainerHTML;

    var metaContainerFn = doT.template(metaContainerHTML);


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
        success: resp => app(el, resp.sheets.listEntries, resp.sheets.standfirstAndTitle)
    });


}
