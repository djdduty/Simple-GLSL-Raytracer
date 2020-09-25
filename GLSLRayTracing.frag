//Made by Jordan Duty(AKA djdduty) May 14, 2014.

#define M_PI 3.141592653589793238462643383279

struct Ray
{
	vec3 Dir;
	vec3 Pos;
};
	
struct Sphere
{
	vec3 Pos;
	vec3 Color;
	float Rad;
	float Reflection;
};

const int numSpheres = 7;
Sphere spheres[numSpheres];

vec3 LightPos = vec3(0,-3,10);
	
vec3 Intersects(Sphere s, Ray r)
{
	float t0, t1;
	vec3 l = s.Pos - r.Pos;
	float tca = dot(l, r.Dir);
	if(tca < 0.0) return vec3(0,0,-1.0);
	float d2 = dot(l, l) - tca*tca;
	if(d2 > s.Rad*s.Rad) return vec3(0,0,-1.0);
	float thc = sqrt((s.Rad*s.Rad) - d2);
	return vec3(tca-thc, tca+thc, 1);
}
	
float mix2(float a, float b, float c)
{
	return b*c+a*(1.0-c);	
}

vec3 Trace3(Ray r)
{
	vec3 Color = vec3(0,0,0);
	Sphere s;
	bool col = false;
	float tnear = 1e8;
	for(int i = 0; i < numSpheres; i++)
	{
		vec3 intTest = Intersects(spheres[i],r);
		if(intTest.z != -1.0) {
			if(intTest.x < tnear) {
				tnear = intTest.x;
				s = spheres[i];
				col = true;
			}
		}
	}
	if(col==false) return vec3(0,0,0);
	vec3 phit = r.Pos + r.Dir * tnear;
	vec3 nhit = phit - s.Pos;
	nhit = normalize(nhit);
	float bias = 1e-4;
	
	vec3 lightDir = LightPos - phit;
	bool blocked = false;
	lightDir = normalize(lightDir);
	float DiffuseFactor = dot(nhit, lightDir);
	vec3 diffuseColor = vec3(0,0,0);
	vec3 ambientColor = vec3(s.Color * 0.2);
	
	for(int n = 0; n < numSpheres; n++)
	{
		Ray rl;
		rl.Pos = phit;
		rl.Dir = lightDir;
		vec3 intTestL = Intersects(spheres[n],rl); 
		if(intTestL.z != -1.0)
		{
			if(intTestL.x < length(LightPos-phit))
				blocked = true;	
		}
	}
	
	if(!blocked)
	{
		if(DiffuseFactor > 0.0)
		{
			diffuseColor = 	vec3(1,1,1)*DiffuseFactor;
			Color += s.Color*diffuseColor + ambientColor;
		}
		else
		{
			Color+=ambientColor;	
		}
	} 
	else
	{
		Color+=ambientColor;
	}
	
	return Color;
}

vec3 Trace2(Ray r)
{
	vec3 Color = vec3(0,0,0);
	Sphere s;
	bool col = false;
	float tnear = 1e8;
	for(int i = 0; i < numSpheres; i++)
	{
		vec3 intTest = Intersects(spheres[i],r);
		if(intTest.z != -1.0) {
			if(intTest.x < tnear) {
				tnear = intTest.x;
				s = spheres[i];
				col = true;
			}
		}
	}
	if(col==false) return vec3(0,0,0);
	vec3 phit = r.Pos + r.Dir * tnear;
	vec3 nhit = phit - s.Pos;
	nhit = normalize(nhit);
	float bias = 1e-4;
	
	bool inside = false;
	if(dot(r.Dir, nhit) > 0.0) nhit *= -1.0, inside = true;
	
	if(s.Reflection > 0.0)
	{
		float facingratio = dot((r.Dir*-1.0), nhit);
		vec3 refldir = r.Dir - nhit * 2.0 * dot(r.Dir, nhit);
		refldir = normalize(refldir);
		Ray rd;
		rd.Pos = phit;
		rd.Dir = refldir;
		vec3 refl = Trace3(rd);
		float param1 = (1.0-s.Reflection);
		float param2 = s.Reflection;
		Color.x = (param1 * Color.x + param2 * refl.x);
		Color.y = (param1 * Color.y + param2 * refl.y);
		Color.z = (param1 * Color.z + param2 * refl.z);
	}
	
	vec3 lightDir = LightPos - phit;
	bool blocked = false;
	lightDir = normalize(lightDir);
	float DiffuseFactor = dot(nhit, lightDir);
	vec3 diffuseColor = vec3(0,0,0);
	vec3 ambientColor = vec3(s.Color * 0.2);
	
	for(int n = 0; n < numSpheres; n++)
	{
		Ray rl;
		rl.Pos = phit;
		rl.Dir = lightDir;
		vec3 intTestL = Intersects(spheres[n],rl); 
		if(intTestL.z != -1.0)
		{
			if(intTestL.x < length(LightPos-phit))
				blocked = true;	
		}
	}
	
	if(!blocked)
	{
		if(DiffuseFactor > 0.0)
		{
			diffuseColor = 	vec3(1,1,1)*DiffuseFactor;
			Color += s.Color*diffuseColor + ambientColor;
		}
		else
		{
			Color+=ambientColor;	
		}
	} 
	else
	{
		Color+=ambientColor;
	}
	
	
	return Color;
}

vec3 Trace(Ray r)
{
	vec3 Color = vec3(0,0,0);
	Sphere s;
	bool col = false;
	float tnear = 1e8;
    
	for(int i = 0; i < numSpheres; i++)
	{
		vec3 intTest = Intersects(spheres[i],r);
		if(intTest.z != -1.0) {
			if(intTest.x < tnear) {
				tnear = intTest.x;
				s = spheres[i];
				col = true;
			}
		}
	}
    
    
	if(col==false) return vec3(0,0,0);
    
    
	vec3 phit = r.Pos + r.Dir * tnear;
	vec3 nhit = phit - s.Pos;
	nhit = normalize(nhit);
	float bias = 1e-4;
	
    
	bool inside = false;
	if(dot(r.Dir, nhit) > 0.0) nhit *= -1.0, inside = true;
	
	if(s.Reflection > 0.0)
	{
		float facingratio = dot((r.Dir*-1.0), nhit);
		vec3 refldir = r.Dir - nhit * 2.0 * dot(r.Dir, nhit);
		refldir = normalize(refldir);
		Ray rd;
		rd.Pos = phit;
		rd.Dir = refldir;
		vec3 refl = Trace2(rd);
		float param1 = (1.0-s.Reflection);
		float param2 = s.Reflection;
		Color.x = (param1 * Color.x + param2 * refl.x);
		Color.y = (param1 * Color.y + param2 * refl.y);
		Color.z = (param1 * Color.z + param2 * refl.z);
	}
	
	vec3 lightDir = LightPos - phit;
	bool blocked = false;
	lightDir = normalize(lightDir);
	float DiffuseFactor = dot(nhit, lightDir);
	vec3 diffuseColor = vec3(0,0,0);
	vec3 ambientColor = vec3(s.Color * 0.2);
	
	for(int n = 0; n < numSpheres; n++)
	{
		Ray rl;
		rl.Pos = phit;
		rl.Dir = lightDir;
		vec3 intTestL = Intersects(spheres[n],rl); 
		if(intTestL.z != -1.0)
		{
			if(intTestL.x < length(LightPos-phit))
				blocked = true;	
		}
	}
	
	if(!blocked)
	{
		if(DiffuseFactor > 0.0)
		{
			diffuseColor = 	vec3(1,1,1)*DiffuseFactor;
			Color += s.Color*diffuseColor + ambientColor;
		}
		else
		{
			Color+=ambientColor;	
		}
	} 
	else
	{
		Color+=ambientColor;
	}
	
	
	return Color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	spheres[0].Pos = vec3(5,0,-0);
	spheres[0].Color = vec3(0.9,0.1,0.1);
	spheres[0].Rad = 4.0;
	spheres[0].Reflection = 0.4;
	
	spheres[1].Pos = vec3(-5,0,-0);
	spheres[1].Color = vec3(0.3,0.3,0.3);
	spheres[1].Rad = 4.0;
	spheres[1].Reflection = 0.3;
	
	spheres[2].Pos = vec3(-5,1004,-0);
	spheres[2].Color = vec3(0.1,0.1,0.1);
	spheres[2].Rad = 1000.0;
	//spheres[2].Reflection = 0.15;
    spheres[2].Reflection = 0.28;
	
	spheres[3].Pos = vec3(-5,0,-1040);
	spheres[3].Color = vec3(0.5,0.5,0.5);
	spheres[3].Rad = 1000.0;
	spheres[3].Reflection = 0.05;
	
	spheres[4].Pos = vec3(1020,0,-0);
	spheres[4].Color = vec3(0.9,0.9,0.0);
	spheres[4].Rad = 1000.0;
	spheres[4].Reflection = 0.05;
	
	spheres[5].Pos = vec3(-1020,0,-0);
	spheres[5].Color = vec3(0.2,0.2,0.7);
	spheres[5].Rad = 1000.0;
	spheres[5].Reflection = 0.05;
	
	spheres[6].Pos = vec3(-5,0,1040);
	spheres[6].Color = vec3(0.0,0.8,0.4);
	spheres[6].Rad = 1000.0;
	spheres[6].Reflection = 0.05;
	
	float invWidth = 1.0 / iResolution.x;
	float invHeight = 1.0 / iResolution.y;
	float fov = 60.0; 
	float aspectratio = iResolution.x/iResolution.y;
	float angle = tan(M_PI * 0.5 * fov / 180.0);
	
	vec3 sinTime = vec3(sin(iTime*2.0));
	
	vec3 camTrans = vec3(20.0*cos(0.5*iTime), 0, 20.0*sin(0.5*iTime));
	vec3 camDir = camTrans - vec3(0);
	
	camTrans.y = -5.0;
	LightPos.y = -10.0;//camTrans;
	
	mat3 rot;
	vec3 f = normalize(camTrans);
	vec3 u = vec3(0,1,0);
	vec3 s = normalize(cross(f,u));
	u = cross(s,f);
	rot[0][0] = s.x; rot[1][0] = s.y; rot[2][0] = s.z;
	rot[0][1] = u.x; rot[1][1] = u.y; rot[2][1] = u.z;
	rot[0][2] = f.x; rot[1][2] = f.y; rot[2][2] = f.z;
	
	Ray R;
	float xx = (2.0 *((fragCoord.x+0.5) * invWidth) -1.0)*angle*aspectratio;
	float yy = (1.0-2.0*((fragCoord.y+0.5)*invHeight))*angle;	
	R.Pos = camTrans;
	R.Dir = vec3(xx,yy,-1) * rot;
	R.Dir = normalize(R.Dir);
	
    
    vec3 col=Trace(R);
    col=pow(col, vec3(0.45454));
	fragColor = vec4(col, 1.0);
}
