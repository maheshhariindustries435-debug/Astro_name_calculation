from fpdf import FPDF

# Create instance of FPDF class
pdf = FPDF()

# Add a page
pdf.add_page()

# Set font
pdf.set_font("Arial", size=12)

# Add names to the PDF
names = [
    "John", "Mary", "David", "Sarah", "Michael", 
    "Emma", "William", "Olivia", "James", "Sophia",
    "Robert", "Jennifer", "Daniel", "Lisa", "Matthew"
]

# Add a title
pdf.cell(200, 10, txt="Test Names for Numerology Calculator", ln=True, align='C')

# Add names
for i, name in enumerate(names):
    pdf.cell(200, 10, txt=f"{i+1}. {name}", ln=True)

# Save the PDF
pdf.output("test_names.pdf")

print("Test PDF created successfully!")