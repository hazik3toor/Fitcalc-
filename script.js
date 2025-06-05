// Global variables
let currentGender = 'male';
let macroChart = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('href');
            document.querySelectorAll('.calculator-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelector(sectionId).classList.add('active');
        });
    });
    
    // Calculate BMI with sample data
    document.getElementById('height').value = '170';
    document.getElementById('weight').value = '65';
    calculateBMI();
    
    // Calculate calories with sample data
    document.getElementById('age').value = '25';
    calculateCalories();
});

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to m
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        document.getElementById('bmi-result').querySelector('.result-value').textContent = '--';
        document.getElementById('bmi-category').querySelector('.category-value').textContent = 'Enter valid details';
        document.getElementById('bmi-category').querySelector('.category-value').style.color = '#6c757d';
        return;
    }
    
    const bmi = weight / (height * height);
    const resultElement = document.getElementById('bmi-result').querySelector('.result-value');
    const categoryElement = document.getElementById('bmi-category').querySelector('.category-value');
    
    resultElement.textContent = bmi.toFixed(1);
    
    let category, color;
    if (bmi < 18.5) {
        category = "Underweight";
        color = 'var(--underweight)';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal weight";
        color = 'var(--normal)';
    } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        color = 'var(--overweight)';
    } else {
        category = "Obese";
        color = 'var(--obese)';
    }
    
    categoryElement.textContent = category;
    categoryElement.style.color = color;
}

// Gender selection
function selectGender(gender) {
    currentGender = gender;
    document.getElementById('male-btn').classList.remove('active');
    document.getElementById('female-btn').classList.remove('active');
    document.getElementById(`${gender}-btn`).classList.add('active');
}

// Calorie Calculator
function calculateCalories() {
    const age = parseFloat(document.getElementById('age').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
        document.getElementById('calorie-result').querySelector('.result-value').textContent = '--';
        return;
    }
    
    let bmr;
    if (currentGender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    const calories = Math.round(bmr * activity);
    document.getElementById('calorie-result').querySelector('.result-value').textContent = calories;
}

// Macronutrient Calculator
function calculateMacros() {
    const goal = document.getElementById('macro-goal').value;
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (isNaN(weight) || weight <= 0) {
        alert("Please enter your weight first in the BMI calculator");
        return;
    }
    
    let protein, carbs, fat;
    
    switch(goal) {
        case "weight-loss":
            protein = Math.round(weight * 2.2);
            carbs = Math.round(weight * 1.5);
            fat = Math.round(weight * 0.5);
            break;
        case "muscle-gain":
            protein = Math.round(weight * 2.5);
            carbs = Math.round(weight * 3);
            fat = Math.round(weight * 0.6);
            break;
        case "keto":
            protein = Math.round(weight * 2);
            carbs = Math.round(weight * 0.5);
            fat = Math.round(weight * 1.8);
            break;
        default: // balanced
            protein = Math.round(weight * 1.8);
            carbs = Math.round(weight * 2.5);
            fat = Math.round(weight * 0.7);
    }
    
    // Update macro values
    document.querySelector('.macro-box.protein .macro-value').textContent = protein;
    document.querySelector('.macro-box.carbs .macro-value').textContent = carbs;
    document.querySelector('.macro-box.fat .macro-value').textContent = fat;
    
    // Calculate percentages
    const total = protein + carbs + fat;
    const proteinPercent = Math.round((protein / total) * 100);
    const carbsPercent = Math.round((carbs / total) * 100);
    const fatPercent = Math.round((fat / total) * 100);
    
    document.querySelector('.macro-box.protein .macro-percent').textContent = `${proteinPercent}%`;
    document.querySelector('.macro-box.carbs .macro-percent').textContent = `${carbsPercent}%`;
    document.querySelector('.macro-box.fat .macro-percent').textContent = `${fatPercent}%`;
    
    // Update chart
    updateMacroChart(proteinPercent, carbsPercent, fatPercent);
}

function updateMacroChart(protein, carbs, fat) {
    const ctx = document.getElementById('macroChart').getContext('2d');
    
    // Destroy previous chart if exists
    if (macroChart) {
        macroChart.destroy();
    }
    
    macroChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [{
                data: [protein, carbs, fat],
                backgroundColor: [
                    'var(--protein)',
                    'var(--carbs)',
                    'var(--fat)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

