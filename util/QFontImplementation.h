/* -*-c++-*- OpenSceneGraph - Copyright (C) 2009-2010 Mathias Froehlich
 *
 * This library is open source and may be redistributed and/or modified under  
 * the terms of the OpenSceneGraph Public License (OSGPL) version 0.0 or 
 * (at your option) any later version.  The full license is in LICENSE file
 * included with this distribution, and on the openscenegraph.org website.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 * OpenSceneGraph Public License for more details.
*/
#ifndef QFontImplementation_H
#define QFontImplementation_H

#include <osgText/Font>
//#include <osgQt/Export>

#include <QtGui/QFont>

#include <string>

namespace myOSG {

class  QFontImplementation : public osgText::Font::FontImplementation
{
public:
    QFontImplementation(const QFont& font);
    virtual ~QFontImplementation();

    virtual std::string getFileName() const;

    virtual bool supportsMultipleFontResolutions() const { return true; }
    
    virtual osgText::Glyph* getGlyph(const osgText::FontResolution& fontRes, unsigned int charcode);
    
    virtual osgText::Glyph3D* getGlyph3D(unsigned int charcode) { return 0; }
    
    virtual osg::Vec2 getKerning(unsigned int leftcharcode, unsigned int rightcharcode, osgText::KerningType kerningType);
    
    virtual bool hasVertical() const;

protected:

    std::string             _filename;
    QFont                   _font;
};

}

#endif
