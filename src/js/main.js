import reqwest from 'reqwest'
import doT from 'olado/doT'
import mainHTML from './text/main.html!text'
import filterHTML from './text/filter.html!text'
import sectionHTML from './text/section.html!text'

import scrollTo from './lib/scroll-to'
import share from './lib/share'

const sheetKey = '1X4epy4vV8XjONqzCsqzNet_j3-047c_PPh6znIP3KyY' 
const sheetPath = 'http://interactive.guim.co.uk/docsdata/';
const sheetFileType = '.json';

const sheetURL = sheetPath+sheetKey+sheetFileType;

//1Dqoxw3RUv0JSXkn5kXcMS0sa57KLjfmffNVZgk8pAts

const sectionIds = ['A', 'B', 'C', 'D', 'E', 'F'];
const sectionTitles = {
    'A': 'Implementing the manifesto',
    'B': 'Surprise annoucements, mostly Tory-flavoured',
    'C': 'U-turns and broken promises',
    'D': 'Delays and tactical retreats',
    'E': 'Excursions into Labourish territory',
    'F': 'Reacting to events'
};

var filterTemplateFn = doT.template(filterHTML);
var sectionTemplateFn = doT.template(sectionHTML);

var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function app(el, days) {

    var sectionDays = {'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': []};
    days.forEach(day => {
        if ((day.hierarchy === 'M' || day.hierarchy === 'H') && !day.imageHL) {
            day.hierarchy = 'B';
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

    document.querySelector('.l-footer').style.display = 'block';
}

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML;

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
        success: resp => app(el, resp.sheets.days)
    });
}
