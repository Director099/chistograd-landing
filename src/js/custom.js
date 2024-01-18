import '../blocks/shared/utils-js/calls';
import '../blocks/shared/utils-js/window-scroll-hidden';

import '../blocks/shared/ui/form/form';
import '../blocks/shared/ui/accordion/accordion';
import '../blocks/shared/ui/btn-sound/btn-sound';

import '../blocks/widgets/content-statistics/content-statistics';
import '../blocks/widgets/block-type/block-type';

document.querySelector('.soc-fix__pic')
  .addEventListener('click', function() {
    this.nextElementSibling.classList.toggle('visibility-hidden')
  })

