export interface Exoplanet {
  pl_name: string;
  hostname: string;
  pl_orbper?: number; // Orbital period in days
  pl_rade?: number; // Planet radius in Earth radii
  pl_masse?: number; // Planet mass in Earth masses
  pl_eqt?: number; // Equilibrium temperature in K
  st_dist: number; // Distance to star in parsecs
  pl_status: string; // Status (e.g., Confirmed)
  pl_discmethod?: string; // Discovery method
  pl_bmassprov?: string; // Mass provenance
  pl_radj?: number; // Planet radius in Jupiter radii
  pl_massj?: number; // Planet mass in Jupiter masses
  st_teff?: number; // Stellar effective temperature in K
  st_rad?: number; // Stellar radius in solar radii
  st_mass?: number; // Stellar mass in solar masses
  pl_orbeccen?: number; // Orbital eccentricity
  pl_orbsmax?: number; // Orbital semi-major axis in AU
  ra?: number; // Right ascension in degrees
  dec?: number; // Declination in degrees
  pl_refname?: string; // Reference name
  pl_disc?: number; // Discovery year
  pl_locale?: string; // Locale (e.g., Temperate, Hot)
  pl_insol?: number; // Insolation flux in Earth units
  pl_dens?: number; // Planet density in g/cm^3
  pl_trandur?: number; // Transit duration in hours
  pl_trandep?: number; // Transit depth in ppm
  pl_ratdor?: number; // Ratio of semi-major axis to stellar radius
  pl_imppar?: number; // Impact parameter
  pl_occdep?: number; // Occultation depth in ppm
  pl_tranmid?: number; // Transit midpoint in BJD
  pl_tsystemref?: string; // Time system reference
  st_refname?: string; // Stellar reference name
  st_spectype?: string; // Spectral type
  st_lum?: number; // Stellar luminosity in solar luminosities
  st_logg?: number; // Stellar surface gravity in log10(cm/s^2)
  st_age?: number; // Stellar age in Gyr
  st_vsin?: number; // Stellar rotational velocity in km/s
  st_acts?: number; // Stellar activity index
  st_actr?: number; // Stellar activity ratio
  st_actlx?: number; // Stellar X-ray activity
  st_actlxerr1?: number; // Stellar X-ray activity upper error
  st_actlxerr2?: number; // Stellar X-ray activity lower error
  st_actlxl?: number; // Stellar X-ray luminosity
  st_actlxle?: number; // Stellar X-ray luminosity error
  sy_refname?: string; // System reference name
  sy_snum?: number; // Number of stars in system
  sy_pnum?: number; // Number of planets in system
  sy_mnum?: number; // Number of moons in system
  cb_flag?: number; // Circumbinary flag
  pl_controv_flag?: number; // Controversial flag
  pl_ttv_flag?: number; // TTV flag
  pl_kep_flag?: number; // Kepler flag
  pl_k2_flag?: number; // K2 flag
  pl_tess_flag?: number; // TESS flag
  pl_cheops_flag?: number; // CHEOPS flag
  pl_ar_flag?: number; // AR flag
  pl_ast_flag?: number; // AST flag
  pl_obm_flag?: number; // OBM flag
  pl_gm_flag?: number; // GM flag
  pl_im_flag?: number; // IM flag
  pl_pp_flag?: number; // PP flag
  pl_ps_flag?: number; // PS flag
  pl_rv_flag?: number; // RV flag
  pl_tran_flag?: number; // Transit flag
  pl_microlens_flag?: number; // Microlensing flag
  pl_pulsar_flag?: number; // Pulsar timing flag
  pl_ptv_flag?: number; // PTV flag
  pl_dft_flag?: number; // DFT flag
  pl_orbtper?: number; // Orbital period error
  pl_orbtpererr1?: number; // Orbital period upper error
  pl_orbtpererr2?: number; // Orbital period lower error
  pl_orblper?: number; // Orbital longitude of periastron
  pl_orblpererr1?: number; // Orbital longitude of periastron upper error
  pl_orblpererr2?: number; // Orbital longitude of periastron lower error
  pl_rvamp?: number; // Radial velocity amplitude
  pl_rvamperr1?: number; // Radial velocity amplitude upper error
  pl_rvamperr2?: number; // Radial velocity amplitude lower error
  pl_radjerr1?: number; // Planet radius upper error
  pl_radjerr2?: number; // Planet radius lower error
  pl_massjerr1?: number; // Planet mass upper error
  pl_massjerr2?: number; // Planet mass lower error
  pl_denserr1?: number; // Planet density upper error
  pl_denserr2?: number; // Planet density lower error
  pl_trandurerr1?: number; // Transit duration upper error
  pl_trandurerr2?: number; // Transit duration lower error
  pl_trandeperr1?: number; // Transit depth upper error
  pl_trandeperr2?: number; // Transit depth lower error
  pl_ratdorerr1?: number; // Ratio of semi-major axis to stellar radius upper error
  pl_ratdorerr2?: number; // Ratio of semi-major axis to stellar radius lower error
  pl_impparerr1?: number; // Impact parameter upper error
  pl_impparerr2?: number; // Impact parameter lower error
  pl_occdeperr1?: number; // Occultation depth upper error
  pl_occdeperr2?: number; // Occultation depth lower error
  pl_tranmiderr1?: number; // Transit midpoint upper error
  pl_tranmiderr2?: number; // Transit midpoint lower error
  st_tefferr1?: number; // Stellar effective temperature upper error
  st_tefferr2?: number; // Stellar effective temperature lower error
  st_raderr1?: number; // Stellar radius upper error
  st_raderr2?: number; // Stellar radius lower error
  st_masserr1?: number; // Stellar mass upper error
  st_masserr2?: number; // Stellar mass lower error
  st_lumerr1?: number; // Stellar luminosity upper error
  st_lumerr2?: number; // Stellar luminosity lower error
  st_loggerr1?: number; // Stellar surface gravity upper error
  st_loggerr2?: number; // Stellar surface gravity lower error
  st_ageerr1?: number; // Stellar age upper error
  st_ageerr2?: number; // Stellar age lower error
  st_vsinerr1?: number; // Stellar rotational velocity upper error
  st_vsinerr2?: number; // Stellar rotational velocity lower error
  st_actserr?: number; // Stellar activity index error
  st_actrerr?: number; // Stellar activity ratio error
  sy_dist?: number; // Distance to solar system in parsecs
  sy_disterr1?: number; // Distance upper error
  sy_disterr2?: number; // Distance lower error
  rowupdate?: string; // Row update date
  pl_pubdate?: string; // Planet publication date
  releasedate?: string; // Release date
}

export interface Exoplanet {
  pl_name: string;
  hostname: string;
  pl_orbper?: number; // Orbital period in days
  pl_rade?: number; // Planet radius in Earth radii
  pl_masse?: number; // Planet mass in Earth masses
  pl_eqt?: number; // Equilibrium temperature in K
  st_dist: number; // Distance to star in parsecs
  pl_status: string; // Status (e.g., Confirmed)
  pl_discmethod?: string; // Discovery method
  pl_bmassprov?: string; // Mass provenance
  pl_radj?: number; // Planet radius in Jupiter radii
  pl_massj?: number; // Planet mass in Jupiter masses
  st_teff?: number; // Stellar effective temperature in K
  st_rad?: number; // Stellar radius in solar radii
  st_mass?: number; // Stellar mass in solar masses
  pl_orbeccen?: number; // Orbital eccentricity
  pl_orbsmax?: number; // Orbital semi-major axis in AU
  ra?: number; // Right ascension in degrees
  dec?: number; // Declination in degrees
  pl_refname?: string; // Reference name
  pl_disc?: number; // Discovery year
  pl_locale?: string; // Locale (e.g., Temperate, Hot)
  pl_insol?: number; // Insolation flux in Earth units
  pl_dens?: number; // Planet density in g/cm^3
  pl_trandur?: number; // Transit duration in hours
  pl_trandep?: number; // Transit depth in ppm
  pl_ratdor?: number; // Ratio of semi-major axis to stellar radius
  pl_imppar?: number; // Impact parameter
  pl_occdep?: number; // Occultation depth in ppm
  pl_tranmid?: number; // Transit midpoint in BJD
  pl_tsystemref?: string; // Time system reference
  st_refname?: string; // Stellar reference name
  st_spectype?: string; // Spectral type
  st_lum?: number; // Stellar luminosity in solar luminosities
  st_logg?: number; // Stellar surface gravity in log10(cm/s^2)
  st_age?: number; // Stellar age in Gyr
  st_vsin?: number; // Stellar rotational velocity in km/s
  st_acts?: number; // Stellar activity index
  st_actr?: number; // Stellar activity ratio
  st_actlx?: number; // Stellar X-ray activity
  st_actlxerr1?: number; // Stellar X-ray activity upper error
  st_actlxerr2?: number; // Stellar X-ray activity lower error
  st_actlxl?: number; // Stellar X-ray luminosity
  st_actlxle?: number; // Stellar X-ray luminosity error
  sy_refname?: string; // System reference name
  sy_snum?: number; // Number of stars in system
  sy_pnum?: number; // Number of planets in system
  sy_mnum?: number; // Number of moons in system
  cb_flag?: number; // Circumbinary flag
  pl_controv_flag?: number; // Controversial flag
  pl_ttv_flag?: number; // TTV flag
  pl_kep_flag?: number; // Kepler flag
  pl_k2_flag?: number; // K2 flag
  pl_tess_flag?: number; // TESS flag
  pl_cheops_flag?: number; // CHEOPS flag
  pl_ar_flag?: number; // AR flag
  pl_ast_flag?: number; // AST flag
  pl_obm_flag?: number; // OBM flag
  pl_gm_flag?: number; // GM flag
  pl_im_flag?: number; // IM flag
  pl_pp_flag?: number; // PP flag
  pl_ps_flag?: number; // PS flag
  pl_rv_flag?: number; // RV flag
  pl_tran_flag?: number; // Transit flag
  pl_microlens_flag?: number; // Microlensing flag
  pl_pulsar_flag?: number; // Pulsar timing flag
  pl_ptv_flag?: number; // PTV flag
  pl_dft_flag?: number; // DFT flag
  pl_orbtper?: number; // Orbital period error
  pl_orbtpererr1?: number; // Orbital period upper error
  pl_orbtpererr2?: number; // Orbital period lower error
  pl_orblper?: number; // Orbital longitude of periastron
  pl_orblpererr1?: number; // Orbital longitude of periastron upper error
  pl_orblpererr2?: number; // Orbital longitude of periastron lower error
  pl_rvamp?: number; // Radial velocity amplitude
  pl_rvamperr1?: number; // Radial velocity amplitude upper error
  pl_rvamperr2?: number; // Radial velocity amplitude lower error
  pl_radjerr1?: number; // Planet radius upper error
  pl_radjerr2?: number; // Planet radius lower error
  pl_massjerr1?: number; // Planet mass upper error
  pl_massjerr2?: number; // Planet mass lower error
  pl_denserr1?: number; // Planet density upper error
  pl_denserr2?: number; // Planet density lower error
  pl_trandurerr1?: number; // Transit duration upper error
  pl_trandurerr2?: number; // Transit duration lower error
  pl_trandeperr1?: number; // Transit depth upper error
  pl_trandeperr2?: number; // Transit depth lower error
  pl_ratdorerr1?: number; // Ratio of semi-major axis to stellar radius upper error
  pl_ratdorerr2?: number; // Ratio of semi-major axis to stellar radius lower error
  pl_impparerr1?: number; // Impact parameter upper error
  pl_impparerr2?: number; // Impact parameter lower error
  pl_occdeperr1?: number; // Occultation depth upper error
  pl_occdeperr2?: number; // Occultation depth lower error
  pl_tranmiderr1?: number; // Transit midpoint upper error
  pl_tranmiderr2?: number; // Transit midpoint lower error
  st_tefferr1?: number; // Stellar effective temperature upper error
  st_tefferr2?: number; // Stellar effective temperature lower error
  st_raderr1?: number; // Stellar radius upper error
  st_raderr2?: number; // Stellar radius lower error
  st_masserr1?: number; // Stellar mass upper error
  st_masserr2?: number; // Stellar mass lower error
  st_lumerr1?: number; // Stellar luminosity upper error
  st_lumerr2?: number; // Stellar luminosity lower error
  st_loggerr1?: number; // Stellar surface gravity upper error
  st_loggerr2?: number; // Stellar surface gravity lower error
  st_ageerr1?: number; // Stellar age upper error
  st_ageerr2?: number; // Stellar age lower error
  st_vsinerr1?: number; // Stellar rotational velocity upper error
  st_vsinerr2?: number; // Stellar rotational velocity lower error
  st_actserr?: number; // Stellar activity index error
  st_actrerr?: number; // Stellar activity ratio error
  sy_dist?: number; // Distance to solar system in parsecs
  sy_disterr1?: number; // Distance upper error
  sy_disterr2?: number; // Distance lower error
  rowupdate?: string; // Row update date
  pl_pubdate?: string; // Planet publication date
  releasedate?: string; // Release date
}

export interface ExoplanetResponse {
  Count: number;
  Columns: string[];
  Data: (string | number | null)[][];
}

// TAP API response format
export interface TAPResponse {
  data: (string | number | null)[][];
  metadata: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
}
