// Handle Sidebar Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const target = link.getAttribute('data-target');
    sections.forEach(section => {
      section.classList.remove('active');
      if (section.id === target) section.classList.add('active');
    });

    // Close dropdown if open
    const dropdown = document.getElementById('dropdown-menu');
    if (dropdown) dropdown.style.display = 'none';
  });
});

// Handle Admin Dropdown
function toggleDropdown() {
  const dropdown = document.getElementById('dropdown-menu');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
