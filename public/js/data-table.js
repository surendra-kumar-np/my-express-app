(function ($) {
  'use strict';

  $(function () {
    // Initialize DataTable for all tables (except those with .no-datatable)
    $('table').each(function () {
      const table = $(this);

      // Skip tables explicitly marked to avoid DataTable
      if (table.hasClass('no-datatable')) return;

      // If already initialized, skip
      if ($.fn.DataTable.isDataTable(table)) return;

      // Initialize DataTable
      table.DataTable({
        aLengthMenu: [
          [5, 10, 15, -1],
          [5, 10, 15, 'All']
        ],
        iDisplayLength: 10,
        language: {
          search: ''
        }
      });

      // Style search box and length dropdown
      const wrapper = table.closest('.dataTables_wrapper');
      const searchInput = wrapper.find('div[id$=_filter] input');
      const lengthSelect = wrapper.find('div[id$=_length] select');

      // Add consistent Bootstrap styles
      searchInput
        .attr('placeholder', 'Search...')
        .removeClass('form-control-sm')
        .addClass('form-control form-control-md');

      lengthSelect
        .removeClass('form-control-sm')
        .addClass('form-control form-control-md');
    });
  });

})(jQuery);
