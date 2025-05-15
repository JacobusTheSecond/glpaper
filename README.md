
# GLPaper
Clone/update of the [glpaper](https://hg.sr.ht/~scoopta/glpaper) with some zxlr protocoll stuff and fragment shaders that should work for reasonably modern systems. Zero guarantuees though, this is 100% a hack.

## Dependencies
	libwayland-dev
	libegl-dev
	pkg-config
	meson
## Building
	hg clone https://hg.sr.ht/~scoopta/glpaper
	cd glpaper
	meson setup build
	ninja -C build
## Installing
	sudo ninja -C build install
## Uninstalling
	sudo ninja -C build uninstall
