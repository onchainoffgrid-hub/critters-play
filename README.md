# Critters on Call — Play

Sheehan Homestead · Callahan, FL

Games: **Evade Elon** · **Barn Cat Defender** · **Pyrenees Guard** · **Critter Match**

Sales aid (Book/Track/Spin/Gold): https://onchainoffgrid-hub.github.io/critters-on-call/

## Live
https://onchainoffgrid-hub.github.io/critters-play/

## Open locally
```bash
python3 -m http.server 8771
```

## Real play → text Michael (consumer path)
Live hub: https://onchainoffgrid-hub.github.io/critters-play/

1. Open **Pyrenees Guard** as **Sophie** (Lead Guardian), or **Evade Elon**
2. Unlock aptitude awards:
   - Sophie → **Lead Guardian** (play a shift)
   - Gus → **Night Scout** at score **250**
   - Betty → **Barn Queen** at score **500**
   - Evade Elon → **Grain Guard** at score **300**
3. Win / unlock screen → **Text HIGH SCORE** to **914-263-1311** (screenshot / score).  
   Deal path stays **CODE / GOAT** — do **not** use those for game wins.
4. Optional Wheel: organic unlock still grants an earn (`?earn=gus|betty|elon`).  
   Spin prizes = **TBD** / soft placeholders — north star is texting Michael.

### Caps (localStorage, per device)
| Cap | Value | Key |
|-----|-------|-----|
| Plays per character per day | **3** (sophie / gus / betty / elon) | `coc_play_caps_v1` |
| Earned spin claims per day | **1** | `coc_play_caps_v1` |
| Claim per earn token | **1** (gus / betty / elon) | `coc_earned_wheel_spins_v1` |

Quiet QA only (not linked in UI): `pyrenees-guard.html?demoUnlock=gus` · `wheel.html?earn=gus&demo=1`
