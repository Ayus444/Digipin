# Digital Postal Index Number (DIGIPIN)

## National Level Addressing Grid

---

**Technical Document – Final version**

---

**Ministry of Communications**  
**Department of Posts**

_March, 2025_

---

## 1. INTRODUCTION

The Department of Posts has undertaken an initiative to establish a Digital Public Infrastructure (DPI) for a standardized, geo-coded addressing system in India. As a part of this initiative, the Department is releasing final version of DIGIPIN – the foundation layer of the DPI. This initiative seeks to provide simplified addressing solutions for seamless delivery of public and private services and to enable “Address as a Service” (AaaS) across the country.

DIGIPIN is an open-source national level addressing grid developed by Department of Posts in collaboration with IIT Hyderabad and NRSC, ISRO and is a key component of the digital address ecosystem. The beta version of the technical document on DIGIPIN was placed for public comments and expert opinion.

After thorough analysis of the comments received through various stakeholder consultations, the Department has now finalized the DIGIPIN Grid that incorporates the relevant inputs. The DIGIPIN layer will serve as a uniform address referencing framework available both offline and online, enabling logical and precise location identification with directional attributes across India, offering significant advantages of ensuring precise geographic identification and thus complementing the conventional addressing system by providing an additional attribute. This would bridge the gap between physical locations and their digital representation.

Incorporating DIGIPIN as an additional address attribute enables the leveraging of GIS capabilities, laying the foundation for future GIS-based digitalization of service delivery across various organizations in a cost-effective manner. The DIGIPIN would enhance location accuracy across various sectors by providing precise geographic coordinates, ensuring accurate service delivery and reducing emergency response times. By integrating DIGIPIN, Banking Financial Services and Insurance sector can leverage the additional address attribute, DIGIPIN, to enhance accuracy and efficiency in their KYC processes. DIGIPIN can simplify address management thus enhancing citizen convenience.

A standardized geo-coded addressing system would enhance India’s geo-spatial ecosystem. It would add to the geospatial knowledge stack of the country in line with the National Geospatial Policy 2022, which seeks to strengthen the geospatial sector to support national development, economic prosperity and a thriving information economy.

> **This document outlines the technical details of DIGIPIN, the National-Level Addressing Grid.**

---

## 2. DESIGN APPROACH

### 2.1 Core Concept:

The DIGIPIN layer is the cornerstone of the entire digital address ecosystem.

DIGIPIN is visualised as an alpha numeric offline grid system that divides the geographical territory of India into uniform 4-meter by 4-meter(approx.) units. Each of these 4m X 4m units (approx.) is assigned a unique 10-digit alphanumeric code, derived from the latitude and longitude coordinates of the unit. This alphanumeric code serves as the offline addressing reference for any specific location within the DIGIPIN system. DIGIPIN is thus strictly a function of the latitude and longitude of the location represented as a grid value. The system is designed to be scalable, adaptable, and integrated with existing GIS applications.

### 2.2 DIGIPIN layer:

DIGIPIN layer will act as the addressing reference system which will be available offline and can be used for locating addresses in a logical manner with directional properties built into it due to the logical naming pattern followed in its construction. DIGIPIN Grid system being an addressing referencing system, can be used as the base stack for development of other ecosystems where addressing is one of the processes in the workflow. Since DIGIPIN solely represents a location and does not store any personal information, it respects privacy.

---

## 3. DIGIPIN : Code Architecture

The detailed structure is such that the DIGIPIN is essentially an encoding of the latitude and longitude of the address into a sequence of alphanumeric symbols using the following 16 symbols: 2, 3, 4, 5, 6, 7, 8, 9, C, J, K, L, M, P, F, T.

The process of identifying the cells is done in a hierarchical fashion. The encoding is performed at various levels, and the basic idea is the following:

A bounding box is used that covers the entire country.

The bounding box is split into 16 (i.e., 4x4) regions. Each region is labeled by one of symbols 2, 3, 4, 5, 6, 7, 8, 9, C, F, J, K, L, M, P, T. The first character in the code would identify one of these regions. This is called the level-1 partition.

Each region is then subdivided into 16 subregions in a similar fashion. Each of the 16 subregions are labeled by the 16 characters. For a given region, the subregion is identified by the second character of the code. Therefore, the first two characters of the code uniquely identify one of the 16^2=256 subregions. This is called the level-2 partition.

The encoding of successive characters, and therefore the next 8 levels is done in an identical fashion. The 10-symbol code therefore uniquely identifies one of the 16^10 cells within the bounding box.

### 3.1 Bounding box:

Following are the details of the bounding box used:
![Figure 1](../images/digipin-grid-bounding-box.png)

- **Longitude:** 63.5° – 99.5° E
- **Latitude:** 2.5° – 38.5° N
- **CRS:** EPSG:4326 (WGS84)
- Includes EEZ and respects city boundaries.
- Grid size after Level-10: ~3.8m × 3.8m

### 3.2 Properties of DIGIPIN

- Easy latitude/longitude extraction
- Works in dense areas
- Human-readable and directional
- Independent of infrastructure
- Short and efficient code

### 3.3 Labelling of regions at various levels

![Figure 2](../images/digipin-grid-labels.png)

- 4x4 grid labels: 2, 3, 4, 5, 6, 7, 8, 9, C, F, J, K, L, M, P, T
- Consistent spiral pattern
- Level-1 to Level-10 follow the same labelling

### 3.4 Assigning DIGIPIN to coordinates coinciding with DIGIPIN Grid Lines

- If on vertical grid line → eastward symbol
- If on horizontal grid line → northward symbol
- If on intersection → top-right grid
- Edge case rules for borders

### 3.5 Grid sizes at various levels

| Code Length | Grid Width | Approx. Distance |
| ----------- | ---------- | ---------------- |
| 1           | 9°         | 1000 km          |
| 2           | 2.25°      | 250 km           |
| 3           | 33'45"     | 62.5 km          |
| 4           | 8'27"      | 15.6 km          |
| 5           | 2'6.75"    | 3.9 km           |
| 6           | 31.7"      | 1 km             |
| 7           | 7.94"      | 250 m            |
| 8           | 1.98"      | 65 m             |
| 9           | 0.5"       | 15 m             |
| 10          | 0.125"     | 3.8 m            |

---

## 4. Key differences between Beta version and Final Version of DIGIPIN

- Bounding box change
- Characters G, W, X replaced with C, F, T
- Uniform labelling across levels

---

## 5. Illustration of DIGIPIN Generation Process

Coordinates of Dak Bhawan (28.622788°N, 77.213033°E)  
DIGIPIN: `3 9J 49L L8T4`

![Level 1 & 2](../images/digipin-generation-dak-bhawan.png)

![Level 3 & 4](../images/digipin-level-3.png) ![Level 4](../images/digipin-level-4.png)  
![Level 5 & 6](../images/digipin-level-5.png) ![Level 6](../images/digipin-level-6.png)  
![Level 7 & 8](../images/digipin-level-7.png) ![Level 8](../images/digipin-level-8.png)  
![Level 9 & 10](../images/digipin-level-9.png) ![Level 10](../images/digipin-level-10.png)

---
