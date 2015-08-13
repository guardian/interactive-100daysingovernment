import reqwest from 'reqwest'
import doT from 'olado/doT'
import mainHTML from './text/main.html!text'
import filterHTML from './text/filter.html!text'
import sectionHTML from './text/section.html!text'

import scrollTo from './lib/scroll-to'
import share from './lib/share'

const sheetURL = 'http://visuals.guim.co.uk/spreadsheetdata/1X4epy4vV8XjONqzCsqzNet_j3-047c_PPh6znIP3KyY.json';

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

function app(el, days) {
    var sectionDays = {'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': []};
    days.forEach(day => {
        if ((day.hierarchy === 'M' || day.hierarchy === 'H') && !day.imagehl) day.hierarchy = 'B';
        sectionDays[day.section].push(day);
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
    sectionsEl.addEventListener('click', evt => {
        evt.preventDefault();
        if (evt.target.className === 'dig-back-to-top') {
            scrollTo(document.body);
        }
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
    filtersEl.addEventListener('click', evt => {
        evt.preventDefault();

        if (evt.target.className === 'dig-filters__filter__link') {
            let sectionId = evt.target.getAttribute('data-section');
            scrollTo(el.querySelector('#dig-section-' + sectionId));
        }
    });

    [].slice.apply(el.querySelectorAll('.js-share')).forEach(shareEl => {
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
