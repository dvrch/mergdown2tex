
 
# Warnings to users

^03f774

1. Equations, tables, and figures should be written only inside the equation-block style (`README.md`)
2. Any syntactic violation that happens inside the obsidian note will be passed into LateX. So far, I have not included any *diagnostic* routine. 
3. When you have many embedded notes and linked notes in the note you want to convert, the algorithm searches within the vault to find them and save their paths in the `DO_NOT_DELETE__note_paths.txt` file. This searching process will take a few seconds (if you have many notes in your vault, and many linked mentions and embedded notes in your note), however, since the paths are now saved into this text file, any conversions you perform afterwards will be very fast. 

![[table__block_table_e78fd4]]

-----

![[figure__block_img_Pasted_ima_4354]]
Concernant la bibliographie, vérifiez que le YAML de votre note contient bien la directive bibliography pointant vers votre fichier .bib. La version Rust devrait maintenant correctement utiliser cette configuration.**


# Development Tasks
- [ ] Allow user to create more complex configurations
- [ ] Tables
	- [ ] Fancy formatting ++
- [ ] Allow the user to change settings from Obsidian, instead of Python

# Formatting

*italic text*

**bold text**

==highlighted text==


# Itemization
## Bullet list
- Item 1
	- item 1.1
	- item 1.2
		- item 1.2.1
- Item 2
	1. Enumeration 1
		1. Enumeration 1.2
		2. Enumeration 2.2
	2. Enumeration 2
		1. Enumeration 2.1
			- Bullet 2.1.1
	3. Enumeration 3

## Enumerated list
1. Item 1
2. Item 2
	1. Item 2.1
	2. Item 2.2

## Task list
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
	- [ ] Task 3.1
- [ ] Task 4
# Adding citations
Command: just mention that link that pertains to the literature file. I use the "p"+"number" naming convention. For example, "p1" would be the first literature file in my vault. 

Example: In [p1](<../Literature/Notes/p1.md>), we see that... ^ad3b86
citation type zoooteroo-integraion+ pandoc  [@QuestCeQue; @QuestCeQue; @Plasma652025]
[@Plasma652025]


In Wilkinson [2006], we see that things work. 
Pandoc style: [@wilkinson2006; @Plasma65; @LogicielLibre]
 

# Equations
Both equations and subfigures are written in the form of embedded notes, since they are encoded as notes.
```ad-warning
If you write an equation outside of the designated template in an embedded note, then the conversion will be faulty!
```
## Writing the equation

Steps:

1. Press ctrl+P, then Quickadd: equation\_block\_single


![[eq__block_Einstein]]


It supports the aligned equations, as seen in [[eq__block_1]].


![[eq__block_1]]

## Referencing the equation
![[eq__block_direct_test]]

In [[eq__block_Einstein]], we see that...
# Figures
## Adding figures
### No subfigures

![[figure__block_gradient_steps]]


### With subfigures
See [[figure__block_1]].


- ➕ Allow user to create more complex configurations

![[figure__block_1]]



## Referencing figures
In [[figure__block_1]], we can notice that...


# Admonition blocks
If you write admonition blocks, they are translated into something similar in latex.
**Example**
```ad-warning
This is a warning
```

```ad-note
This is a note
```


# Code blocks
```python
print("this is a code block")
print("this is another code block")
```

```javascript
<script>
  document.write("Hello World");
</script>
```

# Cross-reference of section
Check [[example_writing#Adding citations|this section]] about adding citations.


# 🔴Cross-reference of block
[[example_writing#^ad3b86|example]]




```bash
ls -l ./texe.md
```

# Emoji et caractere spaciaux test


 −    ✔    🟢   ⚫    🔴   🟡   🙄   🙁  | ➕    🔗   😯  

| 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| −   | ✔   | 🟢  | ⚫   | 🔴  | 🟡  | 🙄  | 🙁  | ➕   | 🔗  | 😯  |

| 12        | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  |     |
| --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \\implies | ❓❓  | ⁉️  | ❓   | ❌   | 🤔  | 🥱  | 😏  | ⚠   | 📚  | 📜  |

| 22  | 23  | 24  | 25  | 26  | 27  | 28  | 29  | 30  | 31  |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 🔭  | 👆  | ☝️  | 👉  | 💭  | 🔧  | ⛏   | 🧪  | ⭐   | 💡  | 📅  |

| 32  | 33  | 34  | 35  | 36  | 37  | 38  | 39  | 40  | 41  | 42  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 📍  | 📜  | 👎  | 🪞  | 👤  | 👥  | 🗣️  | 🏫  | ⚕️  | ⚪  | ✠   |




Assume sections from embedded notes 
The sections from embedded notes can assume the hierarchy of the file wherein they are embedded. ^dddd
```ad-note
Notice in the latex file that the section hierarchy has been modified to adhere to the hierarchy of the file that embeds the note.
```

[[#^dddd]]
# Section 1 of embedded
## subsection 1 of embedded

# Hyperlinks
Click [here](https://www.youtube.com/).


# Tablþes

See [[Writing/table blocks/table__block_1]], [[Writing/table blocks/table__block_2]], and [[Writing/table blocks/table__block_long]].


![[Writing/table blocks/table__block_1]]



![[Writing/table blocks/table__block_2]]


[[Writing/table blocks/table__block_long]]
![[Writing/table blocks/table__block_long]]
![[Writing/table blocks/table__block_long]]

# Latex commands
When there is something niche, or some translation functionality that hasn't been developed yet, you can write a latex command within the code-block functionality of Obsidian, and the translator will not touch it. Use the syntax according to the following example:

```latex
\lipsum[1-4]

\begin{equation}\begin{aligned} \Delta W\_{rg} = -\alpha
\sum\_{s}\&[R+\gamma V(s')-V(s)]  \\ \&[\nabla_{w} \gamma
V(s')-\nabla_{w}V(s)] \end{aligned}
  \hypertarget{eq:eq__block_eq_a09fc9}{}\label{eq:eq__block_eq_a09fc9}
\end{equation}
```

# Inline code parameterization
Open [[fields_for_report#Idea 1|this note]] to modify the fields and add more.
We used method_1. `=choice([[fields_for_report]].argument_1[0], [[fields_for_report]].argument_1[1], "")` `=choice([[fields_for_report]].idea_1[0], [[fields_for_report]].idea_1[1], "")` ^c9a65e



# Appendix
![[example_writing--Appendix]]

# Bibliography Test
In Wilkinson [2006], we see that things work. 
Pandoc style: [@wilkinson2006; @Plasma65; @LogicielLibre]

# Nude Table Test
![[table__block_table_0185b1]]

# Graphs

![[eq__block_eq_a09fc9]]


![[Writing/.eq__block_eq_adadd5]]

![[figure blocks/figure__block_mermaid_gen|figure__block_mermaid_gen]]

direc mmd


## 3. Liens Externages (Système / Hors-Vault)
- Script Python racine : [converter](<../../converter.py>)
- Fichier dans dossier caché .vlatex : [../.vlatex/tmp_blocks/eq__block_2](<../.vlatex/tmp_blocks/eq__block_2.md>)
- Fichier système distant :  [bashrc](<../../../../.bashrc.md>)

## 4. Liens Internet (Web, Embed & Data)
- Site Web : [Google](https://www.google.com)
- YouTube : [Vidéo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
- Image Internet : ![Cloud](https://www.gstatic.com/marketing-cms/assets/images/75/98/d7a4a1254760b96d76382879c575/products-homepage-card.png?fcrop64=1,00000000ffffffff-rw)
- Site Interactif (Embed) : 
<iframe src="https://about.google/intl/fr_ALL/products/?utm_source=about.google&utm_medium=referral&utm_campaig" width="100%" height="400px"></iframe>

- Image Base64 (Test) : ![PixelRouge](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==)


