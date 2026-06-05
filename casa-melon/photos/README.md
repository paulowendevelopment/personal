# Photos

Export photos from your Mac Photos app and drop them in this folder.

## Suggested filenames

| File                  | Used in                        |
|-----------------------|--------------------------------|
| `hero.jpg`            | Hero section background        |
| `exterior.jpg`        | Gallery — apartment exterior   |
| `living-room.jpg`     | Gallery + apartment collage    |
| `terrace.jpg`         | Gallery + apartment collage    |
| `bedroom.jpg`         | Gallery + apartment collage    |
| `kitchen.jpg`         | Gallery                        |
| `balcon.jpg`          | Gallery — Balcon de Europa     |
| `burriana-beach.jpg`  | Gallery                        |
| `nerja-streets.jpg`   | Gallery                        |
| `frigiliana.jpg`      | Gallery                        |

## How to add photos to the site

1. Export from Photos app: select photo → File → Export → Export 1 Photo  
2. Save into this `photos/` folder  
3. In `index.html`, find the relevant placeholder div and replace it with:
   ```html
   <div class="gallery-item gallery-large">
       <img src="photos/your-file.jpg" alt="Description of photo">
       <div class="gallery-overlay"><span>Caption</span></div>
   </div>
   ```
   Remove the `photo-placeholder` class and the `<span class="ph-label">` element.

4. For the **hero background**, open `css/style.css`, find the `.hero-bg` rule, and
   replace the gradient `background:` with:
   ```css
   background:
     linear-gradient(160deg, rgba(15,35,64,0.75) 0%, rgba(196,87,26,0.5) 100%),
     url('../photos/hero.jpg') center / cover no-repeat;
   ```
