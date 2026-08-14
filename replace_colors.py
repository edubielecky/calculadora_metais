import re

# New color palette
new_palette = {
    'primary': '#1E3A8A',
    'secondary': '#374151', 
    'tertiary': '#0F172A',
    'neutral': '#F8FAFC'
}

# Color replacement mapping based on typical dark theme patterns
# Format: old_color -> new_color
color_mappings = {
    '#0b0f19': new_palette['primary'],      # Main dark background -> Primary dark blue
    '#38bdf8': new_palette['secondary'],    # Cyan accent -> Secondary gray
    '#0f172a': new_palette['tertiary'],     # Slate 900 -> Tertiary (already close)
    '#f8fafc': new_palette['neutral'],      # Slate 50 -> Neutral off-white
    '#e2e8f0': '#F1F5F9',                   # Slate 200 -> Lighter gray for borders
    '#94a3b8': '#64748B',                   # Slate 400 -> Muted text
    '#cbd5e1': '#94A3B8',                   # Slate 300 -> Light text
    '#475569': '#374151',                   # Slate 600 -> Secondary gray
    '#334155': '#374151',                   # Slate 700 -> Secondary gray
    '#1e293b': '#0F172A',                   # Slate 800 -> Tertiary
    '#0f172a': '#0F172A',                   # Slate 900 -> Tertiary
    '#020617': '#0F172A',                   # Slate 950 -> Tertiary
}

# rgba mappings
rgba_mappings = {
    'rgba(18, 24, 38, 0.75)': 'rgba(15, 23, 42, 0.75)',  # bg-card -> tertiary
    'rgba(26, 34, 52, 0.9)': 'rgba(30, 58, 138, 0.9)',   # bg-card-hover -> primary
    'rgba(15, 23, 42, 0.75)': 'rgba(15, 23, 42, 0.75)',  # keep tertiary
    'rgba(30, 58, 138, 0.75)': 'rgba(30, 58, 138, 0.75)', # primary hover
}

files_to_modify = ['Src/index.css', 'Src/App.css']

for filepath in files_to_modify:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace hex colors
        for old_color, new_color in color_mappings.items():
            content = content.replace(old_color, new_color)
        
        # Replace rgba colors
        for old_rgba, new_rgba in rgba_mappings.items():
            content = content.replace(old_rgba, new_rgba)
        
        # Write back if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {filepath}")
        else:
            print(f"No changes needed: {filepath}")
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print("Color palette replacement completed!")