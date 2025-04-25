declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions)
      setCenter(latLng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      getCenter(): LatLng
      getZoom(): number
      panTo(latLng: LatLng | LatLngLiteral): void
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void
      getBounds(): LatLngBounds | null
      addListener(eventName: string, handler: Function): MapsEventListener
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral
      clickableIcons?: boolean
      disableDefaultUI?: boolean
      disableDoubleClickZoom?: boolean
      draggable?: boolean
      fullscreenControl?: boolean
      mapTypeControl?: boolean
      mapTypeId?: string
      maxZoom?: number
      minZoom?: number
      restriction?: MapRestriction
      rotateControl?: boolean
      scaleControl?: boolean
      scrollwheel?: boolean
      streetView?: StreetViewPanorama
      styles?: MapTypeStyle[]
      zoom?: number
      zoomControl?: boolean
    }
    
    interface Padding {
      top: number
      right: number
      bottom: number
      left: number
    }
    
    interface MapRestriction {
      latLngBounds: LatLngBounds | LatLngBoundsLiteral
      strictBounds?: boolean
    }
    
    class Marker {
      constructor(opts?: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(latLng: LatLng | LatLngLiteral): void
      setTitle(title: string): void
      setIcon(icon: string | Icon | Symbol): void
      addListener(eventName: string, handler: Function): MapsEventListener
      getPosition(): LatLng | null
    }
    
    interface MarkerOptions {
      animation?: number
      clickable?: boolean
      cursor?: string
      draggable?: boolean
      icon?: string | Icon | Symbol
      label?: string | MarkerLabel
      map?: Map
      opacity?: number
      optimized?: boolean
      position: LatLng | LatLngLiteral
      shape?: MarkerShape
      title?: string
      visible?: boolean
      zIndex?: number
    }
    
    interface MarkerLabel {
      color?: string
      fontFamily?: string
      fontSize?: string
      fontWeight?: string
      text: string
    }
    
    interface MarkerShape {
      coords: number[]
      type: string
    }
    
    interface Icon {
      url: string
      anchor?: Point
      labelOrigin?: Point
      origin?: Point
      scaledSize?: Size
      size?: Size
    }
    
    interface LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean)
      lat(): number
      lng(): number
      toString(): string
      toUrlValue(precision?: number): string
      toJSON(): LatLngLiteral
    }
    
    interface LatLngLiteral {
      lat: number
      lng: number
    }
    
    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral)
      contains(latLng: LatLng | LatLngLiteral): boolean
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds
      getCenter(): LatLng
      getNorthEast(): LatLng
      getSouthWest(): LatLng
      isEmpty(): boolean
      toJSON(): LatLngBoundsLiteral
      toString(): string
      toUrlValue(precision?: number): string
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds
    }
    
    interface LatLngBoundsLiteral {
      east: number
      north: number
      south: number
      west: number
    }
    
    class Point {
      constructor(x: number, y: number)
      x: number
      y: number
    }
    
    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string)
      width: number
      height: number
      equals(other: Size): boolean
      toString(): string
    }
    
    class InfoWindow {
      constructor(opts?: InfoWindowOptions)
      close(): void
      getContent(): string | Element
      getPosition(): LatLng | null
      getZIndex(): number
      open(map: Map | StreetViewPanorama, anchor?: MVCObject): void
      setContent(content: string | Element): void
      setPosition(position: LatLng | LatLngLiteral): void
      setZIndex(zIndex: number): void
      addListener(eventName: string, handler: Function): MapsEventListener
    }
    
    interface InfoWindowOptions {
      content?: string | Element
      disableAutoPan?: boolean
      maxWidth?: number
      position?: LatLng | LatLngLiteral
      zIndex?: number
    }
    
    interface MapTypeStyle {
      elementType?: string
      featureType?: string
      stylers: MapTypeStyler[]
    }
    
    interface MapTypeStyler {
      [k: string]: string | number | boolean
    }
    
    class StreetViewPanorama {
      constructor(container: Element, opts?: StreetViewPanoramaOptions)
    }
    
    interface StreetViewPanoramaOptions {
      addressControl?: boolean
      clickToGo?: boolean
      disableDefaultUI?: boolean
      enableCloseButton?: boolean
      fullscreenControl?: boolean
      linksControl?: boolean
      panControl?: boolean
      position?: LatLng | LatLngLiteral
      pov?: StreetViewPov
      scrollwheel?: boolean
      visible?: boolean
      zoom?: number
      zoomControl?: boolean
    }
    
    interface StreetViewPov {
      heading: number
      pitch: number
    }
    
    interface Symbol {
      anchor?: Point
      fillColor?: string
      fillOpacity?: number
      labelOrigin?: Point
      path: string | SymbolPath
      rotation?: number
      scale?: number
      strokeColor?: string
      strokeOpacity?: number
      strokeWeight?: number
    }
    
    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }
    
    class Geocoder {
      constructor()
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void
    }
    
    interface GeocoderRequest {
      address?: string
      bounds?: LatLngBounds | LatLngBoundsLiteral
      componentRestrictions?: GeocoderComponentRestrictions
      location?: LatLng | LatLngLiteral
      placeId?: string
      region?: string
    }
    
    interface GeocoderComponentRestrictions {
      administrativeArea?: string
      country?: string | string[]
      locality?: string
      postalCode?: string
      route?: string
    }
    
    interface GeocoderResult {
      address_components: GeocoderAddressComponent[]
      formatted_address: string
      geometry: GeocoderGeometry
      partial_match: boolean
      place_id: string
      plus_code?: GeocoderPlusCode
      postcode_localities?: string[]
      types: string[]
    }
    
    interface GeocoderAddressComponent {
      long_name: string
      short_name: string
      types: string[]
    }
    
    interface GeocoderGeometry {
      bounds?: LatLngBounds
      location: LatLng
      location_type: GeocoderLocationType
      viewport: LatLngBounds
    }
    
    enum GeocoderLocationType {
      APPROXIMATE,
      GEOMETRIC_CENTER,
      RANGE_INTERPOLATED,
      ROOFTOP
    }
    
    interface GeocoderPlusCode {
      compound_code: string
      global_code: string
    }
    
    enum GeocoderStatus {
      ERROR,
      INVALID_REQUEST,
      OK,
      OVER_QUERY_LIMIT,
      REQUEST_DENIED,
      UNKNOWN_ERROR,
      ZERO_RESULTS
    }
    
    interface MapsEventListener {
      remove(): void
    }
    
    interface MapMouseEvent {
      latLng?: LatLng;
      stop(): void;
    }
    
    class MVCObject {
      constructor()
      addListener(eventName: string, handler: Function): MapsEventListener
    }
    
    namespace event {
      function addListener(instance: object, eventName: string, handler: Function): MapsEventListener
      function addDomListener(instance: Element, eventName: string, handler: Function, capture?: boolean): MapsEventListener
      function clearInstanceListeners(instance: object): void
      function clearListeners(instance: object, eventName: string): void
      function removeListener(listener: MapsEventListener): void
      function trigger(instance: any, eventName: string, ...args: any[]): void
    }
    
    namespace places {
      class Autocomplete extends MVCObject {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions)
        getPlace(): PlaceResult
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void
        setComponentRestrictions(restrictions: ComponentRestrictions): void
        setTypes(types: string[]): void
      }
      
      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral
        componentRestrictions?: ComponentRestrictions
        fields?: string[]
        placeIdOnly?: boolean
        strictBounds?: boolean
        types?: string[]
      }
      
      interface ComponentRestrictions {
        country: string | string[]
      }
      
      interface PlaceResult {
        address_components?: GeocoderAddressComponent[]
        adr_address?: string
        formatted_address?: string
        geometry?: PlaceGeometry
        icon?: string
        name?: string
        place_id?: string
        plus_code?: GeocoderPlusCode
        types?: string[]
        url?: string
        utc_offset_minutes?: number
        vicinity?: string
      }
      
      interface PlaceGeometry {
        location?: LatLng
        viewport?: LatLngBounds
      }
    }
  }
} 