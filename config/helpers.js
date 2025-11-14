// config/helpers.js
module.exports = {
  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Format a JS date to dd-MMM-yyyy
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  },

  // Generate slug from string
  generateSlug: (name) => {
    if (!name) return '';
    return name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')     // replace spaces and special chars with "-"
      .replace(/^-+|-+$/g, '');      // remove starting/ending hyphens
  },

  // Display user status as colored badge
  userStatus: (status) => {
    return status == '1'
      ? 'Active'
      : 'Inactive';
  }
};
